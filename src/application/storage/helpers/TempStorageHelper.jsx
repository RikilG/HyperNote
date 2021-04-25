export default class TempStorageHelper {
    static instance;
    idCounter = 2;
    tree = {
        name: "TEMP_ROOT",
        path: "",
        id: 0,
        subtree: {
            "Temp storage system": {
                name: "Temp storage system",
                type: "file",
                id: 1,
                subtree: undefined,
                path: "/Temp storage system",
                content:
                    "# Welcome to the temporary storage system! nothing is saved here!",
            },
        },
    };

    static getInstance() {
        if (TempStorageHelper.instance) {
            return TempStorageHelper.instance;
        }
        TempStorageHelper.instance = new TempStorageHelper();
        return TempStorageHelper.instance;
    }

    async getTree(root) {
        return this.tree;
    }

    splitPath(path) {
        path = path.split("/");
        return [
            path.splice(0, path.length - 1).join("/"),
            path[path.length - 1],
        ];
    }

    getNode(filepath) {
        let pos = this.tree;
        filepath = filepath.split("/");
        if (filepath[0] === "") filepath = filepath.splice(1);
        filepath.forEach((element) => {
            pos = pos.subtree[element];
        });
        return pos;
    }

    async readFile(filepath) {
        return this.getNode(filepath).content || "";
    }

    async writeFile(filepath, content) {
        const fileNode = this.getNode(filepath);
        fileNode.content = content;
    }

    async newDirectory(folderpath) {
        const [basename, foldername] = this.splitPath(folderpath);
        const baseNode = this.getNode(basename);
        baseNode.subtree[foldername] = {
            name: foldername,
            id: this.idCounter,
            type: "directory",
            subtree: {},
            path: folderpath,
        };
        this.idCounter = this.idCounter + 1;
    }

    async newFile(filepath) {
        const [basename, filename] = this.splitPath(filepath);
        const baseNode = this.getNode(basename);
        baseNode.subtree[filename] = {
            name: filename,
            id: this.idCounter,
            type: "file",
            content: "# I will be deleted on application exit",
            subtree: undefined,
            path: filepath,
        };
        this.idCounter = this.idCounter + 1;
        return {
            status: 200,
        };
    }

    async move(oldPath, newPath) {}

    async rename(oldpath, newpath) {
        // assuming base path is same for rename
        const [basepath, oldName] = this.splitPath(oldpath);
        const [basepath2, newName] = this.splitPath(newpath);
        if (basepath2 !== basepath) return;
        const baseNode = this.getNode(basepath);
        baseNode.subtree[newName] = baseNode.subtree[oldName];
        delete baseNode.subtree[oldName];
        baseNode.subtree[newName].path = newpath;
        baseNode.subtree[newName].name = newName;
    }

    async delete(filepath) {
        const [basepath, filename] = this.splitPath(filepath);
        const baseNode = this.getNode(basepath);
        delete baseNode.subtree[filename];
    }
}
