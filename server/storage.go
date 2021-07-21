package hypernote

import (
	"encoding/json"
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/spf13/afero"
)



type Note struct {
	Name string
	Path string
}
type Notebook struct {
	Name string
	assets []string
	Notebooks map[string]Notebook
	Notes map[string]Note
}

type Storage struct {
	profile *Profile
	storageFs afero.Fs
	profileFs afero.Fs
}

type StorageApi interface {
	LoadProfile(w http.ResponseWriter, r *http.Request)
	GetTree(w http.ResponseWriter, r *http.Request)
}

func (s *Storage) LoadProfile(w http.ResponseWriter, r *http.Request) {
	var profile Profile
	err := getJsonBody(r, &profile)
	if err != nil {
		writeError(w, err)
		return
	}
	profiles, err := getProfilesFromProfileConfig(s.storageFs)
	if err != nil {
		writeError(w, err)
		return
	}
	if output, i := contains(profiles, profile); output {
		var targetFs = s.storageFs
		var targetPath = profiles[i].Name
		if profiles[i].Path != "" {
			targetFs = afero.NewOsFs()
			targetPath = profiles[i].Path
		}
		exists, err := afero.DirExists(targetFs, targetPath)
		switch {
		case err != nil: writeError(w, err)
		case !exists: writeError(w, ErrInvalidProfilePath)
		default:
			s.profile = &profiles[i]
			s.profileFs = afero.NewBasePathFs(targetFs, targetPath)
			w.WriteHeader(http.StatusOK)
		}
	} else {
		writeError(w, ErrInvalidProfileName)
	}
}

func (s *Storage) GetTree(w http.ResponseWriter, r *http.Request) {
	if s.profile == nil || s.profileFs == nil {
		writeError(w, ErrProfileNotLoaded)
		return
	}

	var filetree = Notebook{
		Name: s.profile.Name,
		Notebooks: make(map[string]Notebook),
		Notes: make(map[string]Note),
	}
	afero.Walk(s.profileFs, "", func(path string, info fs.FileInfo, err error) error {
		if err != nil { return err }
		getTerminalNode := func(splitPath []string) Notebook {
			curPos := filetree
			if len(splitPath) == 1 && splitPath[0] == "." { return curPos }
			for _, dir := range splitPath {
				_, ok := curPos.Notebooks[dir]
				if !ok {
					curPos.Notebooks[dir] = Notebook{Name: info.Name(), Notebooks: make(map[string]Notebook), Notes: make(map[string]Note)}
				}
				curPos = curPos.Notebooks[dir]
			}
			return curPos
		}

		switch {
		case info.IsDir() && strings.Contains(info.Name(), "assets"): // do nothing
		case info.IsDir() && path == "": // do nothing - root dir
		case info.IsDir(): // a notebook / directory
			splitPath := strings.Split(path, afero.FilePathSeparator)
			getTerminalNode(splitPath)
		case !info.IsDir(): // a note / file
			basePath := filepath.Dir(path)
			splitDirPath := strings.Split(basePath, afero.FilePathSeparator)
			termNode := getTerminalNode(splitDirPath)
			termNode.Notes[info.Name()] = Note{info.Name(), path}
		}
		return nil
	})

	writeData(w, filetree, http.StatusOK)
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
