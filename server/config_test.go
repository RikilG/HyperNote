package hypernote_test

import (
	"hypernote"
	"testing"

	"github.com/spf13/afero"
)


func TestGetConfigFromAppData(t *testing.T) {
	t.Run("Get config from AppData", func(t *testing.T) {
		config, err := hypernote.GetConfigFromAppData(afero.NewMemMapFs())

		if config == nil { t.Error("Got <nil> config") }
		checkErr(t, err);
	})

	t.Run("Create config directory if not found in AppData", func(t *testing.T) {
		mockAppDataFS := afero.NewMemMapFs()
		hypernote.NewHyperNoteServer(mockAppDataFS)

		exists, err := afero.DirExists(mockAppDataFS, "HyperNote")
		checkErr(t, err)
		if !exists {
			t.Error("HyperNote directory not created in AppData")
		}
	})

	t.Run("Create config file if not found in AppData config directory", func(t *testing.T) {
		mockAppDataFS := afero.NewMemMapFs()
		mockAppDataFS.Mkdir("HyperNote", 0755)
		hypernote.NewHyperNoteServer(mockAppDataFS)
		
		exists, err := afero.Exists(mockAppDataFS, "HyperNote/config.json")
		checkErr(t, err)
		if !exists {
			t.Error("Config file not created in AppData")
		}
	})

	t.Run("Create storage folder in AppConfig if no storage directory found", func(t *testing.T) {
		mockAppDataFS := afero.NewMemMapFs()
		mockAppDataFS.Mkdir("HyperNote", 0755)
		hypernote.NewHyperNoteServer(mockAppDataFS)
		
		exists, err := afero.DirExists(mockAppDataFS, "HyperNote/storage")
		checkErr(t, err)
		if !exists {
			t.Error("Storage directory not created in AppData")
		}
	})
}
