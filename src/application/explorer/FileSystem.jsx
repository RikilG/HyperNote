export default class FileSystem {
    static generateTree(root) {
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
            return window.fs.readFileSync(filepath, {encoding: "utf-8"});
        }
        return undefined
    }
}