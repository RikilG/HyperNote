import FileSystem from "../storage/FileSystem";
// import { toast } from 'react-toastify';

const fileSystem = FileSystem.getInstance();
const isElectron = window.isElectron;
const path = isElectron && window.require("path");
const basePath =
    isElectron && window.require("electron").remote.app.getPath("userData");
const dataPath = isElectron && path.join(basePath, "userStorage");
const configPath = isElectron && path.join(dataPath, "config.json");
export default class UserPreferences {
    static preferences = {};
    static defaults = {
        theme: "material",
        noteStorage: isElectron && path.join(dataPath, "noteStorage"),
        preferredTimeFormat: "12H",
    };

    static __loadPreferences() {
        const defaultData = { error: true };
        try {
            if (fileSystem.exists(configPath))
                this.preferences = JSON.parse(fileSystem.readFile(configPath));
            else {
                this.preferences = this.defaults;
                this.setPreferences();
            }

            if (!fileSystem.exists(this.preferences.userStorage)) {
                fileSystem.newDirectory(this.preferences.userStorage);
            }
            if (!fileSystem.exists(this.preferences.noteStorage)) {
                fileSystem.newDirectory(this.preferences.noteStorage);
            }

            return this.preferences;
        } catch (error) {
            return defaultData;
        }
    }

    static getPreferences() {
        if (this.preferences === {}) {
            this.__loadPreferences();
        }
        return this.preferences;
    }

    static get(key) {
        if (Object.keys(this.preferences).length === 0) {
            this.__loadPreferences();
        }
        return this.preferences[key];
    }

    static set(key, value) {
        let contents = this.getPreferences();
        if (contents.error === true) return;
        contents[key] = value || true;
        this.preferences = contents;
        this.setPreferences();
    }

    static setPreferences() {
        fileSystem.writeFile(configPath, JSON.stringify(this.preferences));
    }

    static resetDefaults() {
        this.preferences = this.defaults;
        this.setPreferences();
    }
}
