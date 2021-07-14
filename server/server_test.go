package hypernote_test

import (
	"hypernote"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPing(t *testing.T) {
	server := hypernote.NewHyperNoteServer()
	
	request, _ := http.NewRequest(http.MethodGet, "/ping", nil)
	response := httptest.NewRecorder()

	server.ServeHTTP(response, request)
	
	assertStatusCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "HyperNote" {
		t.Errorf("Expected 'HyperNote', got %s", response.Body.String())
	}
}

func TestInfo(t *testing.T) {
	server := hypernote.NewHyperNoteServer()
	
	request, _ := http.NewRequest(http.MethodGet, "/info", nil)
	response := httptest.NewRecorder()

	server.ServeHTTP(response, request)
	
	assertStatusCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "RikilG" {
		t.Errorf("Expected 'RikilG', got %s", response.Body.String())
	}
}

func TestConfig(t *testing.T) {
	server := hypernote.NewHyperNoteServer()
	
	request, _ := http.NewRequest(http.MethodGet, "/config", nil)
	response := httptest.NewRecorder()

	server.ServeHTTP(response, request)
	
	assertStatusCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "HyperNote" {
		t.Errorf("Expected 'HyperNote', got %s", response.Body.String())
	}
}

func TestApi(t *testing.T) {
	server := hypernote.NewHyperNoteServer()
	
	request, _ := http.NewRequest(http.MethodGet, "/api", nil)
	response := httptest.NewRecorder()

	server.ServeHTTP(response, request)
	
	assertStatusCode(t, http.StatusOK, response.Code)
	if response.Body.String() != "HyperNote" {
		t.Errorf("Expected 'HyperNote', got %s", response.Body.String())
	}
}

func assertStatusCode(t testing.TB, expected, got int) {
	t.Helper();
	if expected != got {
		t.Errorf("Expected %d, got %d", expected, got)
	}
}
