package hypernote_test

import (
	"hypernote"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/spf13/afero"
)


func getServer(t testing.TB) (*hypernote.HyperNoteServer) {
	t.Helper()
	server, err := hypernote.NewHyperNoteServer(afero.NewMemMapFs())
	if err != nil { t.Fatal("Error while creating server", err.Error()) }
	return server
}

func newGetRequest(url string) *http.Request {
	request, _ := http.NewRequest(http.MethodGet, url, nil)
	return request
}

func getResponse(server *hypernote.HyperNoteServer, request *http.Request) *httptest.ResponseRecorder {
	response := httptest.NewRecorder()
	server.ServeHTTP(response, request)
	return response
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
