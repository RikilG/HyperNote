export default class FileSystem {
    static getTree(root) {
        if (window.isElectron) { // set in preload.js
            const fs = window.fs;
            const path = window.path;

            let stats = fs.lstatSync(root);
            let tree = {
                path: root,
                name: path.basename(root),
            };
    
            if (stats.isDirectory()) {
                tree.type = "directory";
                tree.children = fs.readdirSync(root).map((child) => FileSystem.getTree(root+'/'+child))
            }
            else {
                tree.type = "file";
            }
            return tree;
        }
        return "No Filesystem";
    }

    static readFile(filepath) {
        if (window.isElectron) {
            return window.fs.readFileSync(filepath, {encoding: "utf-8"});
        }
        return undefined
    }
}