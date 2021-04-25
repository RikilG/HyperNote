import { toast } from "react-toastify";

const isElectron = window.isElectron;

export default class LocalStorageHelper {
    // set in preload.js
    fs = isElectron && window.require("fs");
    path = isElectron && window.require("path");
    localStorageBasePath = "";
    static instance;

    static getInstance() {
        if (LocalStorageHelper.instance) {
            return LocalStorageHelper.instance;
        }
        LocalStorageHelper.instance = new LocalStorageHelper();
        return LocalStorageHelper.instance;
    }

    generateTree(base, root) {
        /**
         * tree = {
         *   id,
         *   path,
         *   name,
         *   type,
         *   subtree,
         * }
         */
        if (!isElectron) return;
        const fullPath = this.join(base, root);
        let stats;
        try {
            stats = this.fs.lstatSync(fullPath);
        } catch (err) {
            console.log(err);
            toast.error("FAILED TO RETRIVE FILE TREE", {
                autoClose: false,
            });
            return {
                path: root,
                name: "FAILED TO RETRIVE FILE TREE",
                type: "file",
            };
        }
        let tree = {
            path: root,
            name: this.path.basename(root),
        };

        if (stats.isDirectory()) {
            tree.type = "directory";
            try {
                tree.subtree = this.fs
                    .readdirSync(fullPath)
                    .map((child) =>
                        this.getTreeWrapper(base, root + "/" + child)
                    );
            } catch (err) {
                console.log(err);
                toast.error("FAILED TO RETRIVE SUB-TREE", {
                    autoClose: false,
                });
                tree.subtree = [
                    {
                        path: root,
                        name: "FAILED TO RETRIVE SUB-TREE",
                        type: "file",
                    },
                ];
            }
        } else {
            tree.type = "file";
        }
        return tree;
    }

    getTreeWrapper(base, root) {
        if (!isElectron) return;
        let tree = this.generateTree(base, root);
        let obj = [tree];

        var iterator = 0; // this is going to be your identifier
        function loop(obj) {
            for (var i in obj) {
                var c = obj[i];
                if (typeof c === "object") {
                    if (c.length === undefined) {
                        //c is not an array
                        c.id = iterator;
                        iterator++;
                    }
                    loop(c);
                }
            }
        }
        loop(obj); // json is your input object
        return obj[0];
    }

    getTree(root) {
        return this.getTreeWrapper(this.localStorageBasePath, root);
    }

    readFile(filepath) {
        if (!isElectron) return;
        filepath = this.localStorageBasePath + filepath;
        try {
            return this.fs.readFileSync(filepath, { encoding: "utf-8" });
        } catch (err) {
            console.log(err);
            toast.error("COULDN'T READ FILE", { autoClose: false });
            return "COULDN'T READ FILE";
        }
    }

    writeFile(filepath, content) {
        if (!isElectron) return;
        filepath = this.localStorageBasePath + filepath;
        try {
            return this.fs.writeFileSync(filepath, content);
        } catch (err) {
            console.log(err);
            toast.error("COULDN'T WRITE FILE", { autoClose: false });
        }
    }

    exists(filepath) {
        if (!isElectron) return;
        filepath = this.localStorageBasePath + filepath;
        try {
            return this.fs.existsSync(filepath);
        } catch (err) {
            console.log(err);
            toast.error(err, { autoClose: false });
        }
    }

    newDirectory(folderpath) {
        if (!isElectron) return;
        folderpath = this.localStorageBasePath + folderpath;
        if (!this.exists(folderpath)) {
            try {
                this.fs.mkdirSync(folderpath);
            } catch (err) {
                console.log(err);
                toast.error("COULDN'T CREATE DIRECTORY", { autoClose: false });
            }
        }
    }

    newFile(filepath) {
        if (!isElectron) return;
        filepath = this.localStorageBasePath + filepath;
        if (!this.exists(filepath)) {
            try {
                this.writeFile(filepath, "");
            } catch (err) {
                console.log(err);
                toast.error("COULDN'T WRITE FILE", { autoClose: false });
            }
        }
    }

    browseFolder() {
        if (!isElectron) return;
        // Async function, returns Promise. take care
        try {
            const { dialog } = window.require("electron").remote;
            return dialog.showOpenDialog({
                properties: ["openDirectory"],
            });
        } catch (err) {
            console.log(err);
            toast.error("ERROR WHILE OPENING NATIVE DIALOG", {
                autoClose: false,
            });
        }
    }

    join(basename, filename) {
        if (!isElectron) return;
        return this.path.join(basename, filename);
    }

    rename(oldpath, newpath) {
        oldpath = this.localStorageBasePath + oldpath;
        newpath = this.localStorageBasePath + newpath;
        if (!isElectron) return;
        try {
            this.fs.renameSync(oldpath, newpath);
        } catch (err) {
            console.log(err);
            toast.error("ERROR WHILE RENAMING FILE", { autoClose: false });
        }
    }

    dirname(filepath) {
        if (!isElectron) return;
        return this.path.dirname(filepath);
    }

    delete(filepath) {
        if (!isElectron) return;
        filepath = this.localStorageBasePath + filepath;
        try {
            const stats = this.fs.lstatSync(filepath);
            if (stats.isDirectory()) {
                this.fs.rmdirSync(filepath, { recursive: true });
            } else {
                this.fs.unlinkSync(filepath);
            }
        } catch (err) {
            console.log(err);
            toast.error("ERROR WHILE DELETING", { autoClose: false });
        }
    }
}
