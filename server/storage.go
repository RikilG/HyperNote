package hypernote

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/spf13/afero"
)


var (
	ErrNotExist = errors.New("specified path does not exist")
	ErrInvalidProfilePath = errors.New("the profile path is invalid")
	ErrDuplicateProfile = errors.New("a profile already exists with the given name")
	ErrInvalidProfileName = errors.New("invalid profile name given")
	ErrDirNotEmpty = errors.New("given directory is not empty")
)

type StorageApi interface {
	GetTree(w http.ResponseWriter, r *http.Request)
	GetProfiles(w http.ResponseWriter, r *http.Request)
	CreateProfile(w http.ResponseWriter, r *http.Request)
	DeleteProfile(w http.ResponseWriter, r *http.Request)
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
	var profile Profile
	err := getJsonBody(r, &profile)
	if err != nil {
		writeError(w, err)
		return
	}
	
	err = createNewProfile(s.Fs, profile)
	if err != nil { writeError(w, err) }
}

func (s *Storage) DeleteProfile(w http.ResponseWriter, r *http.Request) {
	var profile Profile
	err := getJsonBody(r, &profile)
	if err != nil {
		writeError(w, err)
		return
	}
	
	err = deleteProfile(s.Fs, profile)
	if err != nil { writeError(w, err) }
}

func getJsonBody(r *http.Request, output interface{}) error {
	decoder := json.NewDecoder(r.Body)
	return decoder.Decode(&output)
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
