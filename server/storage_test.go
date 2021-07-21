package hypernote_test

import (
	"encoding/json"
	"hypernote"
	"net/http"
	"testing"

	"github.com/spf13/afero"
)


func TestLoadProfile(t *testing.T) {
	profileName := "TestProfile"
	server, _ := getServerWithTestProfiles(t, []string{profileName, "Profile2"})

	t.Run("Load TestProfile", func(t *testing.T) {
		profileBytes, _ := json.Marshal(hypernote.Profile{profileName, ""})
		request := newPostRequest("/api/storage/LoadProfile", profileBytes)
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
	})

	t.Run("Get error on loading invalid profile", func(t *testing.T) {
		profileBytes, _ := json.Marshal(hypernote.Profile{"InvalidProfile", ""})
		request := newPostRequest("/api/storage/LoadProfile", profileBytes)
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusBadRequest, response.Code)
		assertJsonBody(t, response)
		assertError(t, hypernote.ErrInvalidProfileName, response)
	})
}

func TestGetTree(t *testing.T) {
	server, storageFs := getServerWithTestProfiles(t, []string{"profile1", "profile2", "profile3"})

	t.Run("Get error when profile not loaded", func(t *testing.T) {
		request := newGetRequest("/api/storage/GetTree")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusBadRequest, response.Code)
		assertJsonBody(t, response)
		assertError(t, hypernote.ErrProfileNotLoaded, response)
	})

	t.Run("Get notes tree for a profile", func(t *testing.T) {
		var fileTree hypernote.Notebook
		profileName := "profile1"
		profileFs := afero.NewBasePathFs(storageFs, profileName)
		profileFs.Mkdir("notebook1/assets", 0755)
		afero.WriteFile(profileFs, "note1.md", []byte("# Hello"), 0755)
		afero.WriteFile(profileFs, "notebook1/subnote1.md", []byte("# Hello"), 0755)

		loadProfileBytes, _ := json.Marshal(hypernote.Profile{profileName, ""})
		getResponse(server, newPostRequest("/api/storage/LoadProfile", loadProfileBytes))

		request := newGetRequest("/api/storage/GetTree")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
		assertJsonBody(t, response)
		err := json.Unmarshal(response.Body.Bytes(), &fileTree)
		assertString(t, profileName, fileTree.Name)
		assertString(t, "note1.md", fileTree.Notes["note1.md"].Name)
		assertString(t, "notebook1", fileTree.Notebooks["notebook1"].Name)
		assertString(t, "subnote1.md", fileTree.Notebooks["notebook1"].Notes["subnote1.md"].Name)
		checkErr(t, err)
	})
}
