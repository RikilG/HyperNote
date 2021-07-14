package hypernote

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

type HyperNoteServer struct {
	http.Handler
}

func NewHyperNoteServer() *HyperNoteServer {
	s := new(HyperNoteServer)

	router := mux.NewRouter()
	router.HandleFunc("/ping", s.handlePing)
	router.HandleFunc("/info", s.handleInfo)
	router.HandleFunc("/config", s.handleConfig)
	router.HandleFunc("/api", s.handleApi)

	s.Handler = router
	return s
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
