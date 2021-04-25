const isElectron = window.isElectron;
const path = isElectron && window.require("path");
const basePath =
    isElectron && window.require("electron").remote.app.getPath("userData");
const dataPath = isElectron && path.join(basePath, "userStorage");
const configPath = isElectron && path.join(dataPath, "config.json");
export default class UserPreferences {
    static instance;
    preferences = {};
    fileSystem = undefined;
    static defaults = {
        theme: "material",
        noteStorage: isElectron && path.join(dataPath, "noteStorage"),
        preferredTimeFormat: "12H",
        dropboxIntegration: !window.isElectron,
        dropboxConfig: {},
    };

    static getInstance() {
        if (UserPreferences.instance) {
            return UserPreferences.instance;
        }
        UserPreferences.instance = new UserPreferences();
        return UserPreferences.instance;
    }

    setFileSystem(fileSystem) {
        this.fileSystem = fileSystem;
    }

    __loadPreferences() {
        const defaultData = { error: true };
        try {
            if (!this.fileSystem.exists(dataPath)) {
                this.fileSystem.newDirectory(dataPath);
            }

            if (this.fileSystem.exists(configPath))
                this.preferences = JSON.parse(
                    this.fileSystem.readFile(configPath)
                );
            else {
                this.preferences = UserPreferences.defaults;
                this.setPreferences();
            }

            if (!this.fileSystem.exists(this.preferences.noteStorage)) {
                this.fileSystem.newDirectory(this.preferences.noteStorage);
            }
            return this.preferences;
        } catch (error) {
            return defaultData;
        }
    }

    getPreferences() {
        if (this.preferences === {}) {
            this.__loadPreferences();
        }
        return this.preferences;
    }

    get(key) {
        if (Object.keys(this.preferences).length === 0) {
            this.__loadPreferences();
        }
        return this.preferences[key];
    }

    set(key, value) {
        let contents = this.getPreferences();
        if (contents.error === true) return;
        contents[key] = value || true;
        this.preferences = contents;
        this.setPreferences();
    }

    setPreferences() {
        this.fileSystem.writeFile(configPath, JSON.stringify(this.preferences));
    }

    resetDefaults() {
        this.preferences = this.defaults;
        this.setPreferences();
    }
}
