package hypernote

import (
	"encoding/json"

	"github.com/spf13/afero"
)


const profilesName = "profiles.json"
type Profile struct {
	Name string
	Path string
}

func getProfilesFromProfileConfig(fs afero.Fs) (profiles []Profile, err error) {
	defaultProfilesBytes, _ := json.Marshal(make([]Profile, 0))
	createFileIfNotExist(fs, profilesName, defaultProfilesBytes)

	dataBytes, err := afero.ReadFile(fs, profilesName)
	if err != nil { return }
	err = json.Unmarshal(dataBytes, &profiles)
	return
}

func createNewProfile(fs afero.Fs, profile Profile) error {
	profiles, err := getProfilesFromProfileConfig(fs)
	if err != nil { return err }

	profiles = append(profiles, profile)
	data, err := json.Marshal(profiles)
	if err != nil { return err }

	err = afero.WriteFile(fs, profilesName, data, 0755)
	if err != nil { return err }
	return nil
}
