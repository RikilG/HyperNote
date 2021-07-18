package hypernote

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/spf13/afero"
)


type BackendError struct {
	Error string
}
type HyperNoteServer struct {
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
	s.storage = &Storage{
		Fs: afero.NewBasePathFs(appDataFs, config.StoragePath),
	}
	s.Handler = setupRouter(s)
	return s, nil
}

func setupRouter(s *HyperNoteServer) *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/ping", s.handlePing)
	router.HandleFunc("/info", s.handleInfo)
	router.HandleFunc("/config", s.handleConfig)
	router.HandleFunc("/api", s.handleApi)
	router.HandleFunc("/api/storage/GetTree", s.storage.GetTree)
	router.HandleFunc("/api/storage/GetProfiles", s.storage.GetProfiles)
	router.HandleFunc("/api/storage/CreateProfile", s.storage.CreateProfile)
	router.HandleFunc("/api/storage/DeleteProfile", s.storage.DeleteProfile)
	return router
}
