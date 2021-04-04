import DropboxHelper from "./helpers/DropboxHelper";
import LocalStorageHelper from "./helpers/LocalStorageHelper";
import UserPreferences from "./UserPreferences";
export default class FileSystem {
    storage = {
        isLocalConnected: window.isElectron,
        isDropboxConnected: undefined,
    };
    dropboxHelper = undefined;
    localStorageHelper = undefined;
    userPreferences = undefined;
    localStorageBasePath = undefined;
    static instance;

    constructor() {
        this.dropboxHelper = DropboxHelper.getInstance();
        this.localStorageHelper = LocalStorageHelper.getInstance();

        this.userPreferences = UserPreferences.getInstance();
        this.userPreferences.setFileSystem(this.localStorageHelper);
        this.localStorageBasePath = this.userPreferences.get("noteStorage");

        this.storage.isDropboxConnected = this.userPreferences.get(
            "dropboxIntegration"
        );
        if (this.storage.isDropboxConnected) {
            this.dropboxInit();
        }
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

    getTree(root) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.getTree(
                this.localStorageBasePath,
                root || ""
            );
        }
    }

    readFile(filepath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.readFile(
                this.localStorageBasePath + filepath
            );
        }
    }

    writeFile(filepath, content) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.writeFile(
                this.localStorageBasePath + filepath,
                content
            );
        }
    }

    exists(filepath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.exists(
                this.localStorageBasePath + filepath
            );
        }
    }

    newDirectory(folderpath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.newDirectory(
                this.localStorageBasePath + folderpath
            );
        }
    }

    newFile(filepath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.newFile(
                this.localStorageBasePath + filepath
            );
        }
    }

    browseFolder() {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.browseFolder();
        }
    }

    join(basename, filename) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.join(basename, filename);
        }
    }

    dirname(filepath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.dirname(filepath);
        }
    }

    rename(oldpath, newpath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.rename(
                this.localStorageBasePath + oldpath,
                this.localStorageBasePath + newpath
            );
        }
    }

    delete(filepath) {
        if (this.storage.isLocalConnected) {
            return this.localStorageHelper.delete(
                this.localStorageBasePath + filepath
            );
        }
    }
}
