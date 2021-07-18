package hypernote_test

import (
	"hypernote"
	"net/http"
	"testing"

	"github.com/spf13/afero"
)


func TestNewHyperNoteServer(t *testing.T) {
	appDataFs := afero.NewMemMapFs()
	_, err := hypernote.NewHyperNoteServer(appDataFs)
	checkErr(t, err)
}

func TestEndpoints(t *testing.T) {
	server := getServer(t)

	t.Run("Test /ping", func(t *testing.T) {
		request := newGetRequest("/ping")
		response := getResponse(server, request)
		
		assertStatusCode(t, http.StatusOK, response.Code)
		if response.Body.String() != "HyperNote" {
			t.Errorf("Expected 'HyperNote', got %s", response.Body.String())
		}
	})

	t.Run("Test /info", func(t *testing.T) {
		request := newGetRequest("/info")
		response := getResponse(server, request)
		
		assertStatusCode(t, http.StatusOK, response.Code)
		if response.Body.String() != "RikilG" {
			t.Errorf("Expected 'RikilG', got %s", response.Body.String())
		}
	})

	t.Run("Test /config", func(t *testing.T) {
		request := newGetRequest("/config")
		response := getResponse(server, request)
		
		assertStatusCode(t, http.StatusOK, response.Code)
		if response.Body.String() != "HyperNote" {
			t.Errorf("Expected 'HyperNote', got %s", response.Body.String())
		}
	})

	t.Run("Test /api", func(t *testing.T) {
		request := newGetRequest("/api")
		response := getResponse(server, request)
		
		assertStatusCode(t, http.StatusOK, response.Code)
		if response.Body.String() != "HyperNote" {
			t.Errorf("Expected 'HyperNote', got %s", response.Body.String())
		}
	})
}
