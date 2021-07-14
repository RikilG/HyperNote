package main

import (
	"hypernote"
	"log"
	"net/http"
)

func main() {
	log.Println("Welcome to HyperNote")
	server := hypernote.NewHyperNoteServer()
	log.Fatal(http.ListenAndServe(":5000", server))
}
