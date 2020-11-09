export default class FileSystem {
    static generateTree(root) {
        if (window.isElectron) { // set in preload.js
            const fs = window.require('fs');
            const path = window.require('path');

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
    }

    static getTree(root) {
        let tree = FileSystem.generateTree(root);
        let obj = [tree];

        var iterator = 0; // this is going to be your identifier
        function loop(obj){
            for(var i in obj){
                var c = obj[i];
                if(typeof c === 'object'){
                    if(c.length === undefined){ //c is not an array
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
            return window.require('fs').readFileSync(filepath, {encoding: "utf-8"});
        }
        return undefined
    }

    static writeFile(filepath, content) {
        if (window.isElectron) {
            return window.require('fs').writeFileSync(filepath, content);
        }
    }

    static exists(filepath) {
        return (window.isElectron && window.require('fs').existsSync(filepath));
    }

    static newDirectory(folderpath) {
        if (window.isElectron && !this.exists(folderpath)) {
            window.require('fs').mkdirSync(folderpath);
        }
    }

    static browseFolder() { // Async function, returns Promise. take care
        if (window.isElectron) {
            const { dialog } = window.require('electron').remote;
            return dialog.showOpenDialog({
                properties: ['openDirectory']
            });
        }
    }
}