import FileSystem from "./FileSystem";
import { toast } from "react-toastify";
const sqlite3 = window.require("sqlite3");
const { ipcRenderer } = window.require("electron");

const POMO_DB = "pomodoroDB";
const CALENDAR_DB = "calendarDB";

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

function send(message) {
    return new Promise((resolve) => {
        ipcRenderer.once("asynchronous-reply", (_, arg) => {
            resolve(arg);
        });
        ipcRenderer.send("asynchronous-message", message);
    });
}

const runDBQuery = (props, callback) => {
    send(props).then((res) => {
        if (res.error) {
            toast.error(res.error);
            console.log(res.error);
        }
        if (callback) callback(res.data);
    });
};

export { openDatabase, send, runDBQuery, POMO_DB, CALENDAR_DB };

// const createQuery = (db, query, callback) => {
//     db.run(query, (err) => {
//         handleSqlError(err);
//         if (callback) callback();
//     });
// };

// const readQuery = (db, query, callback) => {
//     db.all(query, (err, rows) => {
//         handleSqlError(err);
//         if (!rows) handleSqlError("NO ROWS RECEIVED");
//         if (callback) callback(rows);
//     });
// };

// const updateQuery = (db, query, changeList, callback) => {
//     db.run(query, changeList, (err) => {
//         handleSqlError(err);
//         if (callback) callback();
//     });
// };
