package hypernote

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/afero"
)


var (
	ErrNotExist = errors.New("specified path does not exist")
	ErrInvalidProfilePath = errors.New("the profile path is invalid")
	ErrDuplicateProfile = errors.New("a profile already exists with the given name")
	ErrInvalidProfileName = errors.New("invalid profile name given")
	ErrDirNotEmpty = errors.New("given directory is not empty")
)

type BackendError struct {
	Error string
}
type HyperNoteServer struct {
	profiles ProfilesApi
	storage StorageApi
	http.Handler
}

func (s *HyperNoteServer) handlePing(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HyperNote")
}

func (s *HyperNoteServer) handleInfo(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "RikilG")
}

func (s *HyperNoteServer) handleConfig(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HyperNote")
}

func (s *HyperNoteServer) handleApi(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "HyperNote")
}

func NewHyperNoteServer(appDataFs afero.Fs) (*HyperNoteServer, error) {
	config, err := GetConfigFromAppData(appDataFs)
	if err != nil { return nil, err }

	s := new(HyperNoteServer)
	s.profiles = &Profiles{
		Fs: afero.NewBasePathFs(appDataFs, config.StoragePath),
	}
	s.storage = &Storage{}
	s.Handler = setupRouter(s)
	return s, nil
}

func setupRouter(s *HyperNoteServer) *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/ping", s.handlePing)
	router.HandleFunc("/info", s.handleInfo)
	router.HandleFunc("/config", s.handleConfig)
	router.HandleFunc("/api", s.handleApi)
	router.HandleFunc("/api/profiles/GetProfiles", s.profiles.GetProfiles)
	router.HandleFunc("/api/profiles/CreateProfile", s.profiles.CreateProfile)
	router.HandleFunc("/api/profiles/DeleteProfile", s.profiles.DeleteProfile)
	router.HandleFunc("/api/storage/GetTree", s.storage.GetTree)
	return router
}
