package hypernote

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/spf13/afero"
)


var ErrNotExist = errors.New("specified path does not exist")

type StorageApi interface {
	GetTree(w http.ResponseWriter, r *http.Request)
	GetProfiles(w http.ResponseWriter, r *http.Request)
	CreateProfile(w http.ResponseWriter, r *http.Request)
}

type Storage struct {
	Fs afero.Fs
}

func (s *Storage) GetTree(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "StorageTree")
}

func (s *Storage) GetProfiles(w http.ResponseWriter, r *http.Request) {	
	profiles, err := getProfilesFromProfileConfig(s.Fs)
	if err != nil {
		writeError(w, err)
		return
	}
	dataBytes, err := json.Marshal(profiles)
	if err != nil {
		writeError(w, err)
	} else {
		writeData(w, dataBytes, http.StatusOK)
	}
}

func (s *Storage) CreateProfile(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var profile Profile
	err := decoder.Decode(&profile)
	if err != nil {
		writeError(w, err)
	} else {
		if profile.Path != "" {
			exists, err := afero.DirExists(afero.NewOsFs(), profile.Path)
			if err != nil {
				writeError(w, err)
				return
			}
			if !exists {
				writeError(w, ErrNotExist)
				return
			}
		} else { // if path is == "", then create in AppData/HyperNote/storage
			createDirIfNotExist(s.Fs, profile.Name)
		}
		createNewProfile(s.Fs, profile)
	}
}

func writeData(w http.ResponseWriter, data []byte, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	w.Write(data)
}

func writeError(w http.ResponseWriter, err error) {
	errData, _ := json.Marshal(BackendError{ err.Error() })
	writeData(w, errData, http.StatusBadRequest)
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
