package main

import (
	"hypernote"
	"log"
	"net/http"
	"os"

	"github.com/spf13/afero"
)


func main() {
	log.Println("Welcome to HyperNote")

	port := ":5000"
	appDataDir, err := os.UserConfigDir()
	quitOnError(err)
	appDataFs := afero.NewBasePathFs(afero.NewOsFs(), appDataDir)

	server, err := hypernote.NewHyperNoteServer(appDataFs)
	quitOnError(err)

	log.Println("Application running on", port)
	err = http.ListenAndServe(port, server)
	if err != nil {
		log.Fatal(err)
	}
}

func quitOnError(err error) {
	if err != nil {
		log.Fatal(err.Error())
		panic(err)
	}
}
