import { toast } from "react-toastify";
import DropboxHelper from "./cloud/DropboxHelper";

export default class FileSystem {
    // set in preload.js
    fs = window.isElectron && window.require("fs");
    path = window.isElectron && window.require("path");
    static dropboxHelper = new DropboxHelper();
    static instance = new FileSystem();

    static getInstance() {
        return this.instance;
    }

    generateTree(root) {
        if (window.isElectron) {
            let stats;
            try {
                stats = this.fs.lstatSync(root);
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
                        .readdirSync(root)
                        .map((child) => this.getTree(root + "/" + child));
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
    }

    getTree(root) {
        let tree = this.generateTree(root);
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

    readFile(filepath) {
        if (window.isElectron) {
            try {
                return this.fs.readFileSync(filepath, { encoding: "utf-8" });
            } catch (err) {
                console.log(err);
                toast.error("COULDN'T READ FILE", { autoClose: false });
                return "COULDN'T READ FILE";
            }
        }
        return undefined;
    }

    writeFile(filepath, content) {
        if (window.isElectron) {
            try {
                return this.fs.writeFileSync(filepath, content);
            } catch (err) {
                console.log(err);
                toast.error("COULDN'T WRITE FILE", { autoClose: false });
            }
        }
    }

    exists(filepath) {
        try {
            return window.isElectron && this.fs.existsSync(filepath);
        } catch (err) {
            console.log(err);
            toast.error(err, { autoClose: false });
        }
    }

    newDirectory(folderpath) {
        if (window.isElectron && !this.exists(folderpath)) {
            try {
                this.fs.mkdirSync(folderpath);
            } catch (err) {
                console.log(err);
                toast.error("COULDN'T CREATE DIRECTORY", { autoClose: false });
            }
        }
    }

    newFile(filepath) {
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
        // Async function, returns Promise. take care
        if (window.isElectron) {
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
    }

    join(basename, filename) {
        if (window.isElectron) {
            return this.path.join(basename, filename);
        }
    }

    rename(oldpath, newpath) {
        if (window.isElectron) {
            try {
                this.fs.renameSync(oldpath, newpath);
            } catch (err) {
                console.log(err);
                toast.error("ERROR WHILE RENAMING FILE", { autoClose: false });
            }
        }
    }

    dirname(filepath) {
        if (window.isElectron) {
            return this.path.dirname(filepath);
        }
    }

    delete(filepath) {
        if (window.isElectron) {
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
}
