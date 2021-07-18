package hypernote_test

import (
	"bytes"
	"encoding/json"
	"hypernote"
	"net/http"
	"testing"

	"github.com/spf13/afero"
)


func TestGetTree(t *testing.T) {
	server := getServer(t)

	t.Run("Get notes tree for a profile", func(t *testing.T) {
		request := newGetRequest("/api/storage/GetTree")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
	})
}

func TestGetProfiles(t *testing.T) {
	server := getServer(t)

	t.Run("Get available user profiles from config", func(t *testing.T) {
		var profiles []hypernote.Profile
		request := newGetRequest("/api/storage/GetProfiles")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
		assertJsonBody(t, response)
		err := json.Unmarshal(response.Body.Bytes(), &profiles)
		checkErr(t, err)
		if len(profiles) != 0 {
			t.Errorf("Expected empty profiles array, Got: %v", profiles)
		}
	})

	t.Run("Get error on invalid user profiles json", func(t *testing.T) {
		appDataFs := afero.NewMemMapFs()
		server, err := hypernote.NewHyperNoteServer(appDataFs)
		checkErr(t, err)
		afero.WriteFile(appDataFs, "HyperNote/storage/profiles.json", []byte("invalidJSON"), 0755)
		
		request := newGetRequest("/api/storage/GetProfiles")
		response := getResponse(server, request)

		assertJsonParseError(t, response)
		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})
}

func TestCreateProfile(t *testing.T) {
	server := getServer(t)

	t.Run("Create new profile", func(t *testing.T) {
		profileName := "Profile1"
		newProfileData, err := json.Marshal(hypernote.Profile{profileName, ""})
		checkErr(t, err)

		request := newPostRequest("/api/storage/CreateProfile", bytes.NewReader(newProfileData))
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)

		var profiles []hypernote.Profile
		response2 := getResponse(server, newGetRequest("/api/storage/GetProfiles"))
		err = json.Unmarshal(response2.Body.Bytes(), &profiles)
		checkErr(t, err)
		if profiles[0].Name != profileName {
			t.Error("Profile name does not match")
		}
	})

	t.Run("Incorrect format provided in post request body", func(t *testing.T) {
		data := bytes.NewReader([]byte("invalidJSON"))
		request := newPostRequest("/api/storage/CreateProfile", data)
		response := getResponse(server, request)
		
		assertJsonParseError(t, response)
		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})

	t.Run("Invalid profile path provided", func(t *testing.T) {
		profileName := "Profile1"
		newProfileData, err := json.Marshal(hypernote.Profile{profileName, "X:\\invalid"})
		checkErr(t, err)

		request := newPostRequest("/api/storage/CreateProfile", bytes.NewReader(newProfileData))
		response := getResponse(server, request)
		backendError := getErrorFromResponse(t, response)
		
		assertJsonBody(t, response)
		assertError(t, hypernote.ErrNotExist, backendError)
		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})
}
