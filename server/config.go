package hypernote

import (
	"encoding/json"

	"github.com/spf13/afero"
)


type Config struct {
	StoragePath string
}

func GetConfigFromAppData(appDataFs afero.Fs) (*Config, error) {
	config := new(Config)
	appDataRootPath := "HyperNote"
	storagePath := "HyperNote/storage"
	configPath := "HyperNote/config.json"
	defaultConfigBytes, err := json.Marshal(Config{StoragePath: storagePath})
	if err != nil { return nil, err }

	createDirIfNotExist(appDataFs, appDataRootPath)
	createDirIfNotExist(appDataFs, storagePath)
	createFileIfNotExist(appDataFs, configPath, defaultConfigBytes)
	
	configData, err := afero.ReadFile(appDataFs, configPath)
	if err != nil { return nil, err }
	err = json.Unmarshal(configData, &config)
	if err != nil { return nil, err }

	return config, nil
}
