package hypernote_test

import (
	"net/http"
	"testing"
)


func TestGetTree(t *testing.T) {
	server := getServer(t)

	t.Run("Get notes tree for a profile", func(t *testing.T) {
		request := newGetRequest("/api/storage/GetTree")
		response := getResponse(server, request)

		assertStatusCode(t, http.StatusOK, response.Code)
	})
}
