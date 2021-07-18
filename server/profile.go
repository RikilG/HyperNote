package hypernote

import (
	"encoding/json"
	"path/filepath"

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
	contains := func(profiles []Profile, profile Profile) bool {
		for _, p := range profiles {
			if p.Name == profile.Name { return true }
		}
		return false
	}

	profiles, err := getProfilesFromProfileConfig(fs)
	if err != nil { return err }
	if contains(profiles, profile) {
		return ErrDuplicateProfile
	}

	if profile.Path != "" {
		osFs := afero.NewOsFs()
		exists, err := afero.DirExists(osFs, profile.Path)
		if err != nil { return err }
		if !exists { return ErrNotExist }
		files, err := afero.ReadDir(osFs, profile.Path)
		if err != nil { return err }
		if len(files) != 0 {
			return ErrDirNotEmpty
		}
		assetsPath := filepath.Join(profile.Path, "assets")
		createDirIfNotExist(osFs, assetsPath)
	} else { // if path is == "", then create in AppData/HyperNote/storage
		assetsPath := filepath.Join(profile.Name, "assets")
		createDirIfNotExist(fs, profile.Name)
		createDirIfNotExist(fs, assetsPath)
	}

	profiles = append(profiles, profile)
	writeProfileConfig(fs, profiles)
	return nil
}

func deleteProfile(fs afero.Fs, profile Profile) error {
	profiles, err := getProfilesFromProfileConfig(fs)
	if err != nil { return err }

	checkProfileStorage := func(fs afero.Fs, path string) error {
		assetsPath := filepath.Join(path, "assets")
		exists, err := afero.DirExists(fs, assetsPath)
		if err != nil { return err }
		if !exists { return ErrInvalidProfilePath }
		return nil
	}

	newProfileSet := make([]Profile, 0)
	for _, p := range profiles {
		if p.Name == profile.Name {
			path := p.Name
			fsTemp := fs
			if p.Path != "" { // profile not present in AppData/HyperNote/Storage
				path = p.Path
				fsTemp = afero.NewOsFs()
			}
			err := checkProfileStorage(fsTemp, path)
			if err != nil { return err }
			fsTemp.RemoveAll(path)
		} else {
			newProfileSet = append(newProfileSet, p)
		}
	}
	if len(newProfileSet) == len(profiles) {
		return ErrInvalidProfileName
	}

	writeProfileConfig(fs, newProfileSet)
	return nil
}

func writeProfileConfig(fs afero.Fs, profiles []Profile) error {
	data, err := json.Marshal(profiles)
	if err != nil { return err }

	err = afero.WriteFile(fs, profilesName, data, 0755)
	if err != nil { return err }
	return nil
}
