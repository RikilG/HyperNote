package hypernote_test

import (
	"bytes"
	"encoding/json"
	"hypernote"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/spf13/afero"
)


func getServer(t testing.TB) (*hypernote.HyperNoteServer) {
	t.Helper()
	server, err := hypernote.NewHyperNoteServer(afero.NewMemMapFs())
	if err != nil { t.Fatal("Error while creating server", err.Error()) }
	return server
}

func getServerWithTestProfiles(t testing.TB, profileList []string) (*hypernote.HyperNoteServer, afero.Fs) {
	t.Helper()
	var profiles = make([]hypernote.Profile, 0)
	storagePath := "HyperNote/storage"
	configPath := "HyperNote/config.json"
	profilesPath := storagePath + "/profiles.json"
	appDataFs := afero.NewMemMapFs()

	appDataFs.MkdirAll(storagePath, 0755)
	defaultConfigBytes, err := json.Marshal(hypernote.Config{StoragePath: storagePath})
	checkErr(t, err)
	afero.WriteFile(appDataFs, configPath, defaultConfigBytes, 0755)
	for _, profile := range profileList {
		appDataFs.MkdirAll(storagePath + "/" + profile + "/assets", 0755)
		profiles = append(profiles, hypernote.Profile{profile, ""})
	}
	profileConfigBytes, err := json.Marshal(profiles)
	checkErr(t, err)
	afero.WriteFile(appDataFs, profilesPath, profileConfigBytes, 0755)
	server, err := hypernote.NewHyperNoteServer(appDataFs)
	if err != nil { t.Fatal("Error while creating server", err.Error()) }
	return server, afero.NewBasePathFs(appDataFs, storagePath)
}

func newGetRequest(url string) *http.Request {
	request, _ := http.NewRequest(http.MethodGet, url, nil)
	return request
}

func newPostRequest(url string, body []byte) *http.Request {
	bodyReader := bytes.NewReader(body)
	request, _ := http.NewRequest(http.MethodPost, url, bodyReader)
	return request
}

func getResponse(server *hypernote.HyperNoteServer, request *http.Request) *httptest.ResponseRecorder {
	response := httptest.NewRecorder()
	server.ServeHTTP(response, request)
	return response
}

func getErrorFromResponse(t testing.TB, response *httptest.ResponseRecorder) hypernote.BackendError {
	t.Helper()
	var backendError hypernote.BackendError
	err := json.Unmarshal(response.Body.Bytes(), &backendError)
	checkErr(t, err)
	return backendError
}

func checkErr(t testing.TB, err error) {
	t.Helper()
	if err != nil {
		t.Error("Encountered error: ", err.Error())
	}
}

func assertStatusCode(t testing.TB, expected, got int) {
	t.Helper()
	if expected != got {
		t.Errorf("Expected %d, got %d", expected, got)
	}
}

func assertString(t testing.TB, expected, got string) {
	t.Helper()
	if expected != got {
		t.Errorf("Expected %q, got %q", expected, got)
	}
}

func assertJsonBody(t testing.TB, response *httptest.ResponseRecorder) {
	t.Helper()
	assertString(t, "application/json", response.Header().Get("Content-Type"))
}

func assertError(t testing.TB, expected error, response *httptest.ResponseRecorder) {
	t.Helper()
	err := getErrorFromResponse(t, response)
	if expected.Error() != err.Error {
		t.Errorf("Expected %q, got %q", expected.Error(), err.Error)
	}
}

func assertJsonParseError(t testing.TB, response *httptest.ResponseRecorder) {
	t.Helper()
	assertJsonBody(t, response)
	backendError := getErrorFromResponse(t, response)
	if !strings.Contains(backendError.Error, "looking for beginning of value") {
		t.Error("Expecting error on JSON parse. Instead got something else")
	}
}
