package hypernote

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/spf13/afero"
)


type StorageApi interface {
	GetTree(w http.ResponseWriter, r *http.Request)
}

type Storage struct {}

func (s *Storage) GetTree(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "StorageTree")
}

func getJsonBody(r *http.Request, output interface{}) error {
	decoder := json.NewDecoder(r.Body)
	return decoder.Decode(&output)
}

func writeData(w http.ResponseWriter, data interface{}, statusCode int) {
	jsonData, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(jsonData)
}

func writeError(w http.ResponseWriter, err error) {
	writeData(w, BackendError{ err.Error() }, http.StatusBadRequest)
}

func createDirIfNotExist(fs afero.Fs, path string) error {
	exists, err := afero.DirExists(fs, path)
	if err != nil { return err }
	if !exists {
		fs.MkdirAll(path, 0755)
	}
	return nil
}

func createFileIfNotExist(fs afero.Fs, path string, content []byte) error {
	exists, err := afero.Exists(fs, path)
	if err != nil { return err }
	if !exists {
		file, err := fs.Create(path)
		if err != nil { return err }
		defer file.Close()
		file.Write(content)
	}
	return nil
}
