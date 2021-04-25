import DropboxHelper from "./helpers/DropboxHelper";
import LocalStorageHelper from "./helpers/LocalStorageHelper";
import TempStorageHelper from "./helpers/TempStorageHelper";
import UserPreferences from "./UserPreferences";

export const StorageType = {
    LOCAL: "local",
    DROPBOX: "dropbox",
    TEMP: "temp",
};

export default class FileSystem {
    storageInfo = {
        [StorageType.LOCAL]: {
            name: "Local Storage",
            connected: window.isElectron,
        },
        [StorageType.DROPBOX]: {
            name: "Dropbox",
            connected: undefined,
        },
        [StorageType.TEMP]: {
            name: "Temporary",
            connected: true,
        },
    };
    dropboxHelper = undefined;
    localStorageHelper = undefined;
    tempStorageHelper = undefined;
    userPreferences = undefined;
    currentStorage = undefined; // set via StorageContext
    static instance;

    constructor() {
        this.dropboxHelper = DropboxHelper.getInstance();
        this.localStorageHelper = LocalStorageHelper.getInstance();
        this.tempStorageHelper = TempStorageHelper.getInstance();

        this.userPreferences = UserPreferences.getInstance();
        this.userPreferences.setFileSystem(this.localStorageHelper);
        this.localStorageHelper.localStorageBasePath = this.userPreferences.get(
            "noteStorage"
        );

        this.storageInfo[
            StorageType.DROPBOX
        ].connected = this.userPreferences.get("dropboxIntegration");

        if (this.storageInfo[StorageType.DROPBOX].connected) {
            this.dropboxInit();
        }

        this.currentStorage = this.tempStorageHelper;
    }

    static getInstance() {
        if (FileSystem.instance) {
            return FileSystem.instance;
        }
        FileSystem.instance = new FileSystem();
        return FileSystem.instance;
    }

    dropboxInit() {
        const config = this.userPreferences.get("dropboxConfig");
        const params = this.dropboxHelper.init(config);
        this.userPreferences.set("dropboxConfig", params);
    }

    setCurrentStorage(storage) {
        if (storage === StorageType.LOCAL) {
            this.currentStorage = this.localStorageHelper;
        } else if (storage === StorageType.DROPBOX) {
            this.currentStorage = this.dropboxHelper;
        } else {
            this.currentStorage = this.tempStorageHelper;
        }
    }

    async getTree(root) {
        return await this.currentStorage.getTree(root || "");
    }

    async readFile(filepath) {
        return await this.currentStorage.readFile(filepath);
    }

    async writeFile(filepath, content) {
        return await this.currentStorage.writeFile(filepath, content);
    }

    async exists(filepath) {
        return await this.currentStorage.exists(filepath);
    }

    async newDirectory(folderpath) {
        return await this.currentStorage.newDirectory(folderpath);
    }

    async newFile(filepath) {
        return await this.currentStorage.newFile(filepath);
    }

    async browseFolder() {
        if (this.currentStorage === this.localStorageHelper) {
            return await this.currentStorage.browseFolder();
        }
    }

    join(basename, filename) {
        if (this.currentStorage === this.localStorageHelper) {
            return this.currentStorage.join(basename, filename);
        }
        // perform string joining
        if (basename.endsWith("\\")) {
            basename[basename.length - 1] = "/";
        }
        if (filename.startsWith("\\")) {
            filename[0] = "/";
        }
        const baseSlash = basename.endsWith("/");
        const fileSlash = filename.startsWith("/");
        if (baseSlash && fileSlash) {
            return basename + filename.slice(1);
        } else if (baseSlash || fileSlash) return basename + filename;
        else return basename + "/" + filename;
    }

    dirname(filepath) {
        if (this.currentStorage === this.localStorageHelper) {
            return this.currentStorage.dirname(filepath);
        }
        let separator;
        if (filepath.includes("/")) {
            separator = "/";
        } else if (filepath.includes("\\")) {
            separator = "\\";
        } else {
            // no separator, i.e., direct file name given; dirname is root itself
            return "/";
        }
        const path = filepath.split(separator);
        return path.splice(0, path.length - 1).join(separator);
    }

    async rename(oldpath, newpath) {
        return await this.currentStorage.rename(oldpath, newpath);
    }

    async delete(filepath) {
        return await this.currentStorage.delete(filepath);
    }
}
