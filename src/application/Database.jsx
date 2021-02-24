import FileSystem from "./FileSystem";
import { toast } from "react-toastify";
const sqlite3 = window.require("sqlite3");
const { ipcRenderer } = window.require("electron");

function openDatabase(dbpath) {
    send("ping").then((res) => console.log(res));
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

function send(message) {
    return new Promise((resolve) => {
        ipcRenderer.once("asynchronous-reply", (_, arg) => {
            resolve(arg);
        });
        ipcRenderer.send("asynchronous-message", message);
    });
}

export { openDatabase, send };
