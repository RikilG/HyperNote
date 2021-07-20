package hypernote_test

import (
	"encoding/json"
	"hypernote"
	"net/http"
	"testing"

	"github.com/spf13/afero"
)


func TestGetProfiles(t *testing.T) {
	server := getServer(t)

	t.Run("Get available user profiles from config", func(t *testing.T) {
		var profiles []hypernote.Profile
		profileName := "TestProfile"
		createTestProfile(server, profileName)
		request := newGetRequest("/api/profiles/GetProfiles")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
		assertJsonBody(t, response)
		err := json.Unmarshal(response.Body.Bytes(), &profiles)
		checkErr(t, err)
		if len(profiles) != 1 || profiles[0].Name != profileName {
			t.Errorf("Expected 1 profile, Got: %v", profiles)
		}
	})

	t.Run("Get error on invalid user profiles json", func(t *testing.T) {
		appDataFs := afero.NewMemMapFs()
		server, _ := hypernote.NewHyperNoteServer(appDataFs)
		afero.WriteFile(appDataFs, "HyperNote/storage/profiles.json", []byte("invalidJSON"), 0755)

		request := newGetRequest("/api/profiles/GetProfiles")
		response := getResponse(server, request)

		assertJsonParseError(t, response)
		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})
}

func TestCreateProfile(t *testing.T) {
	server := getServer(t)

	t.Run("Create new profile", func(t *testing.T) {
		appDataFs := afero.NewMemMapFs()
		server, _ := hypernote.NewHyperNoteServer(appDataFs)
		profileName := "Profile1"
		newProfileData, _ := json.Marshal(hypernote.Profile{profileName, ""})

		request := newPostRequest("/api/profiles/CreateProfile", newProfileData)
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)

		var profiles []hypernote.Profile
		response2 := getResponse(server, newGetRequest("/api/profiles/GetProfiles"))
		err := json.Unmarshal(response2.Body.Bytes(), &profiles)
		checkErr(t, err)
		if profiles[0].Name != profileName {
			t.Error("Profile name does not match")
		}
		exists, err := afero.DirExists(appDataFs, "HyperNote/storage/"+profileName)
		checkErr(t, err)
		if !exists {
			t.Error("Directory not created for profile")
		}
	})

	t.Run("Incorrect format provided in post request body", func(t *testing.T) {
		data := []byte("invalidJSON")
		request := newPostRequest("/api/profiles/CreateProfile", data)
		response := getResponse(server, request)

		assertJsonParseError(t, response)
		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})

	t.Run("Invalid profile path provided", func(t *testing.T) {
		profileName := "Profile1"
		newProfileData, _ := json.Marshal(hypernote.Profile{profileName, "X:\\invalid"})

		request := newPostRequest("/api/profiles/CreateProfile", newProfileData)
		response := getResponse(server, request)
		backendError := getErrorFromResponse(t, response)

		assertJsonBody(t, response)
		assertError(t, hypernote.ErrNotExist, backendError)
		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})

	t.Run("Create duplicate profile", func(t *testing.T) {
		profileName := "ProfileDup"
		// create a profile to test duplicate functionality
		profileData := createTestProfile(server, profileName)
		request := newPostRequest("/api/profiles/CreateProfile", profileData)
		response := getResponse(server, request)
		err := getErrorFromResponse(t, response)

		assertStatusCode(t, http.StatusBadRequest, response.Code)
		assertError(t, hypernote.ErrDuplicateProfile, err)
	})
}

func TestDeleteProfile(t *testing.T) {
	server := getServer(t)

	t.Run("Delete a given profile", func(t *testing.T) {
		appDataFs := afero.NewMemMapFs()
		server, _ := hypernote.NewHyperNoteServer(appDataFs)
		profileName := "Profile1"

		profileData := createTestProfile(server, profileName)
		request := newPostRequest("/api/profiles/DeleteProfile", profileData)
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
		exists, err := afero.DirExists(appDataFs, "HyperNote/storage/"+profileName)
		checkErr(t, err)
		if exists {
			t.Error("Profile directory not deleted")
		}

		var profiles []hypernote.Profile
		response = getResponse(server, newGetRequest("/api/profiles/GetProfiles"))

		json.Unmarshal(response.Body.Bytes(), &profiles)
		if len(profiles) != 0 {
			t.Errorf("Expected empty profiles array, Got: %v", profiles)
		}
	})

	t.Run("Don't delete directory without assets", func(t *testing.T) {
		appDataFs := afero.NewMemMapFs()
		server, _ := hypernote.NewHyperNoteServer(appDataFs)
		profileName := "Profile1"

		profileData := createTestProfile(server, profileName)
		appDataFs.RemoveAll("HyperNote/storage/" + profileName + "/assets")
		request := newPostRequest("/api/profiles/DeleteProfile", profileData)
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusBadRequest, response.Code)
		exists, _ := afero.DirExists(appDataFs, "HyperNote/storage/"+profileName)
		if !exists {
			t.Error("Profile directory deleted!")
		}
		// check that profile should not be deleted
		var profiles []hypernote.Profile
		response = getResponse(server, newGetRequest("/api/profiles/GetProfiles"))
		json.Unmarshal(response.Body.Bytes(), &profiles)
		if len(profiles) == 0 {
			t.Errorf("Expected non-empty profiles array, Got: %v", profiles)
		}
	})

	t.Run("Try to delete invalid profile", func(t *testing.T) {
		profileName := "InvalidProfileName"
		profileData, _ := json.Marshal(hypernote.Profile{profileName, ""})

		request := newPostRequest("/api/profiles/DeleteProfile", profileData)
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusBadRequest, response.Code)
	})
}

func createTestProfile(server *hypernote.HyperNoteServer, profileName string) []byte {
	profileData, _ := json.Marshal(hypernote.Profile{profileName, ""})
	createRequest := newPostRequest("/api/profiles/CreateProfile", profileData)
	getResponse(server, createRequest)
	return profileData
}