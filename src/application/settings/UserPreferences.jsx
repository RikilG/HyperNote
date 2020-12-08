import { toast } from "react-toastify";
import FileSystem from "../explorer/FileSystem";
// import { toast } from 'react-toastify';

export default class UserPreferences {
    static path = window.require("path");
    static basePath = window.require("electron").remote.app.getPath("userData");
    static dataPath = this.path.join(this.basePath, "userStorage");
    static configPath = this.path.join(this.dataPath, "config.json");
    static preferences = {};
    static defaults = {
        theme: "material",
        userStorage: this.dataPath,
        noteStorage: this.path.join(this.dataPath, "noteStorage"),
        pomoStorage: this.path.join(this.dataPath, "pomoStorage.db"),
        calendarStorage: this.path.join(this.dataPath, "calendarStorage.db"),
    };

    static __loadPreferences() {
        const defaultData = { error: true };
        try {
            if (FileSystem.exists(this.configPath))
                this.preferences = JSON.parse(
                    FileSystem.readFile(this.configPath)
                );
            else {
                this.preferences = this.defaults;
                this.setPreferences();
            }

            if (!FileSystem.exists(this.preferences.userStorage)) {
                FileSystem.newDirectory(this.preferences.userStorage);
            }
            if (!FileSystem.exists(this.preferences.noteStorage)) {
                FileSystem.newDirectory(this.preferences.noteStorage);
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
        if (key === "userStorage" && typeof value !== "string") {
            toast.error("Tryin to store true again?!", {
                autoClose: false,
            });
            return;
        }
        let contents = this.getPreferences();
        if (contents.error === true) return;
        contents[key] = value || true;
        this.preferences = contents;
        this.setPreferences();
    }

    static setPreferences() {
        FileSystem.writeFile(this.configPath, JSON.stringify(this.preferences));
    }

    static resetDefaults() {
        this.preferences = this.defaults;
        this.setPreferences();
    }
}
