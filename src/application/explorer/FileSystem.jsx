import { toast } from 'react-toastify';

export default class FileSystem {
    static generateTree(root) {
        if (window.isElectron) { // set in preload.js
            const fs = window.require('fs');
            const path = window.require('path');

            let stats;
            try {
                stats = fs.lstatSync(root);
            }
            catch (err) {
                console.log(err);
                toast.error("FAILED TO RETRIVE FILE TREE", { autoClose: false });
                return { path: root, name: "FAILED TO RETRIVE FILE TREE", type: "file" };
            }
            let tree = {
                path: root,
                name: path.basename(root),
            };

            if (stats.isDirectory()) {
                tree.type = "directory";
                try {
                    tree.children = fs.readdirSync(root).map((child) => FileSystem.getTree(root + '/' + child));
                }
                catch (err) {
                    console.log(err);
                    toast.error("FAILED TO RETRIVE SUB-TREE", { autoClose: false });
                    tree.children = [{ path: root, name: "FAILED TO RETRIVE SUB-TREE", type: "file" }];
                }
            }
            else {
                tree.type = "file";
            }
            return tree;
        }
    }

    static getTree(root) {
        let tree = FileSystem.generateTree(root);
        let obj = [tree];

        var iterator = 0; // this is going to be your identifier
        function loop(obj) {
            for (var i in obj) {
                var c = obj[i];
                if (typeof c === 'object') {
                    if (c.length === undefined) { //c is not an array
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

    static readFile(filepath) {
        if (window.isElectron) {
            try {
                return window.require('fs').readFileSync(filepath, { encoding: "utf-8" });
            }
            catch (err) {
                console.log(err);
                toast.error("COULDN'T READ FILE", { autoClose: false });
                return "COULDN'T READ FILE";
            }
        }
        return undefined
    }

    static writeFile(filepath, content) {
        if (window.isElectron) {
            try {
                return window.require('fs').writeFileSync(filepath, content);
            }
            catch (err) {
                console.log(err);
                toast.error("COULDN'T WRITE FILE", { autoClose: false });
            }
        }
    }

    static exists(filepath) {
        try {
            return (window.isElectron && window.require('fs').existsSync(filepath));
        }
        catch (err) {
            console.log(err);
            toast.error(err, { autoClose: false });
        }
    }

    static newDirectory(folderpath) {
        if (window.isElectron && !this.exists(folderpath)) {
            try {
                window.require('fs').mkdirSync(folderpath);
            }
            catch (err) {
                console.log(err);
                toast.error("COULDN'T CREATE DIRECTORY", { autoClose: false });
            }
        }
    }

    static newFile(filepath) {
        if (!this.exists(filepath)) {
            try {
                this.writeFile(filepath, "");
            }
            catch (err) {
                console.log(err);
                toast.error("COULDN'T WRITE FILE", { autoClose: false });
            }
        }
    }

    static browseFolder() { // Async function, returns Promise. take care
        if (window.isElectron) {
            try {
                const { dialog } = window.require('electron').remote;
                return dialog.showOpenDialog({
                    properties: ['openDirectory']
                });
            }
            catch (err) {
                console.log(err);
                toast.error("ERROR WHILE OPENING NATIVE DIALOG", { autoClose: false });
            }
        }
    }
}