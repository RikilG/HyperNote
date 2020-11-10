import { toast } from 'react-toastify';
import FileSystem from '../explorer/FileSystem';
// import { toast } from 'react-toastify';

export default class UserPreferences {
    static dataPath = window.require('electron').remote.app.getPath('userData');
    static configPath = window.require('path').join(this.dataPath, 'config.json');
    static preferences = {};
    static defaults = {
        theme: "material",
        userStorage: window.require('path').join(this.dataPath, 'userStorage'),
    };

    static __loadPreferences() {
        const defaultData = { error: true };
        try {
            if (FileSystem.exists(this.configPath))
                this.preferences = JSON.parse(FileSystem.readFile(this.configPath));
            else {
                this.preferences = this.defaults;
                this.setPreferences();
            }

            if (!FileSystem.exists(this.preferences.userStorage)) {
                FileSystem.newDirectory(this.preferences.userStorage);
            }

            return this.preferences;
        }
        catch(error) {
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
        if (key === 'userStorage' && typeof value !== "string") {
            toast.error("Tryin to store true again?!", { autoClose: false });
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