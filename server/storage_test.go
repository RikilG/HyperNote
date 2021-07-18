package hypernote_test

import (
	"encoding/json"
	"hypernote"
	"net/http"
	"strings"
	"testing"

	"github.com/spf13/afero"
)


func TestApiStorageGetTree(t *testing.T) {
	server := getServer(t)

	t.Run("Get notes tree for a profile", func(t *testing.T) {
		request := newGetRequest("/api/storage/GetTree")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
	})
}

func TestApiStorageGetProfiles(t *testing.T) {
	server := getServer(t)

	t.Run("Get available user profiles from config", func(t *testing.T) {
		var profiles []hypernote.Profile
		request := newGetRequest("/api/storage/GetProfiles")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
		assertString(t, "application/json", response.Header().Get("Content-Type"))
		err := json.Unmarshal(response.Body.Bytes(), &profiles)
		checkErr(t, err)
		if len(profiles) != 0 {
			t.Errorf("Expected empty profiles array, Got: %v", profiles)
		}
	})

	t.Run("Get error on invalid user profiles json", func(t *testing.T) {
		var backendError hypernote.BackendError
		appDataFs := afero.NewMemMapFs()
		server, err := hypernote.NewHyperNoteServer(appDataFs)
		checkErr(t, err)
		afero.WriteFile(appDataFs, "HyperNote/storage/profiles.json", []byte("invalidJSON"), 0755)
		
		request := newGetRequest("/api/storage/GetProfiles")
		response := getResponse(server, request)
		err = json.Unmarshal(response.Body.Bytes(), &backendError)
		checkErr(t, err)

		assertStatusCode(t, http.StatusOK, response.Code)
		assertString(t, "application/json", response.Header().Get("Content-Type"))
		if !strings.Contains(backendError.Error, "looking for beginning of value") {
			t.Error("Expecting error on JSON parse. Instead got something else")
		}
	})
}
