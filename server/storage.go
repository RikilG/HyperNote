package hypernote

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/spf13/afero"
)


type StorageApi interface {
	GetTree(w http.ResponseWriter, r *http.Request)
	GetProfiles(w http.ResponseWriter, r *http.Request)
}

type Storage struct {
	Fs afero.Fs
}

func (s *Storage) GetTree(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "StorageTree")
}

func (s *Storage) GetProfiles(w http.ResponseWriter, r *http.Request) {
	var testProfiles []Profile
	var err error
	profilesName := "profiles.json"
	defaultProfilesBytes, _ := json.Marshal(make([]Profile, 0))

	w.Header().Set("Content-Type", "application/json")
	createFileIfNotExist(s.Fs, profilesName, defaultProfilesBytes)
	dataBytes, err := afero.ReadFile(s.Fs, profilesName)
	if err != nil {
		w.Write(getJsonError(err))
		return
	}
	err = json.Unmarshal(dataBytes, &testProfiles)
	if err != nil {
		w.Write(getJsonError(err))
	} else {
		w.Write(dataBytes)
	}
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