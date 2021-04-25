import { Dropbox } from "dropbox";

const clientId = "isolkaqnjg07lcv";
const redirectURL = window.isElectron
    ? "http://localhost:3000"
    : "http://localhost:5000/auth/dropbox";

// TODO: have a caching client to reduce no of calls made (ex: for getTree and all)

export default class DropboxHelper {
    dbx = new Dropbox(); // TODO: change to null
    static instance;

    static getInstance() {
        if (DropboxHelper.instance) {
            return DropboxHelper.instance;
        }
        DropboxHelper.instance = new DropboxHelper();
        return DropboxHelper.instance;
    }

    init(config) {
        // TODO: get a refresh token for longer retention of cloud access
        const urlParams = window.location.href.split("#");
        if (!config && urlParams.length === 1) {
            // no params after '#', no config. Needs to perform auth
            this.auth();
        } else if (urlParams.length !== 1) {
            // we have parameters in URL
            return this.parseParams();
        } else {
            // we only have a config
            const expiry = new Date(config.accessTokenExpiresAt || 0);
            if (new Date() > expiry) {
                // TODO: refresh token here
                // accessToken is expired. need perform auth
                this.auth();
            }
        }
        return config;
    }

    auth() {
        const dbx = new Dropbox({ clientId: clientId });
        dbx.auth.getAuthenticationUrl(redirectURL).then((authUrl) => {
            window.location.href = authUrl;
        });
    }

    parseParams() {
        // dropbox adds the tokens after '#' in the redirected URL
        let urlParams = window.location.href;
        if (urlParams.includes("#")) {
            urlParams = urlParams.split("#");
        } else if (urlParams.includes("?")) {
            urlParams = urlParams.split("?");
        }
        const queryParams = {};
        const s = urlParams[1].split("&");
        for (let i in s) {
            let param = s[i].split("=");
            queryParams[param[0]] = param[1];
        }
        const params = {
            accessToken: queryParams.access_token,
            clientId: clientId,
            accessTokenExpiresAt: new Date(
                new Date().getTime() + queryParams.expires_in * 1000
            ),
            refreshToken: queryParams.refresh_token,
        };
        this.dbx = new Dropbox(params);
        return params;
    }

    async getTree(root) {
        let entries;
        try {
            let response = await this.dbx.filesListFolder({
                path: root,
                recursive: true,
            });
            response = response.result;
            entries = response.entries;
            while (response.has_more) {
                response = await this.dbx.filesListFolderContinue({
                    cursor: response.cursor,
                });
                response = response.result;
                entries.push(...response.entries);
            }
        } catch (e) {
            console.log("ERROR in DBX");
            console.log(e);
        }
        /**
         * response list obj type:
            .tag: "folder"
            id: "id:rMHTvN123FkAAAAAAAAAIg"
            name: "Facts"
            path_display: "/Facts"
            path_lower: "/facts"
         */

        let dict = {};

        entries.forEach((entry) => {
            let displayPath = entry.path_display;
            displayPath = displayPath.split("/");
            let cur = dict;
            for (let i in displayPath) {
                let name = displayPath[i];
                if (name === "") continue;
                if (parseInt(i) === displayPath.length - 1) {
                    // check .tag for type
                    cur[name] = {
                        subtree: entry[".tag"] === "file" ? undefined : {},
                        ...cur[name],
                        name: entry.name,
                        type: entry[".tag"] === "file" ? "file" : "directory",
                        path: entry.path_display,
                        id: entry.id,
                    };
                } else {
                    // always a folder
                    if (!cur[name]) {
                        cur[name] = {
                            // create folder treeObj
                            name: name,
                            type: "directory",
                            subtree: {}, // will be converted to array later
                            // below will be set when we encounter the object for this folder
                            path: undefined,
                            id: undefined,
                        };
                    }
                    cur = cur[name].subtree;
                }
            }
        });

        return {
            name: "DROPBOX_ROOT",
            type: "directory",
            path: "",
            id: 0,
            subtree: dict,
        };
    }

    async readFile(filepath) {
        const response = await this.dbx.filesDownload({
            path: filepath,
        });
        const fileBlob = response.result.fileBlob;
        return await fileBlob.text();
    }

    async writeFile(filepath, content) {
        return await this.dbx.filesUpload({
            contents: content,
            path: filepath,
            mode: {
                ".tag": "overwrite",
            },
        });
    }

    async newDirectory(folderpath) {
        return await this.dbx.filesCreateFolderV2({
            path: folderpath,
        });
    }

    async newFile(filepath) {
        try {
            return await this.writeFile(filepath, `# ${Date()}`);
        } catch (err) {
            console.log(err);
            return { status: 400 };
        }
    }

    browseFolder() {}

    async move(oldPath, newPath) {
        return await this.dbx.filesMoveV2({
            from_path: oldPath,
            to_path: newPath,
        });
    }

    async rename(oldpath, newpath) {
        return await this.move(oldpath, newpath);
    }

    async delete(filepath) {
        return await this.dbx.filesDeleteV2({
            path: filepath,
        });
    }
}
