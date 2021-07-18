package hypernote_test

import (
	"net/http"
	"testing"
)


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
