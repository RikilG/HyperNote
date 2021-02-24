import FileSystem from "./FileSystem";
import { toast } from "react-toastify";
const sqlite3 = window.require("sqlite3");

function openDatabase(dbpath) {
    if (!FileSystem.exists(dbpath)) {
        toast("Creating new databse");
    }
    let db = new sqlite3.Database(dbpath, (err) => {
        if (err) {
            toast(err);
            return;
        }
    });
    return db;
}

export { openDatabase };
