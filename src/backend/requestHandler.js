const { ipcMain } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const basePath = require("electron").app.getPath("userData");
const dataPath = path.join(basePath, "userStorage");
// const configPath = path.join(dataPath, "config.json");

const IN_STREAM = "asynchronous-message";
const OUT_STREAM = "asynchronous-reply";
const OPERATIONS = {
    CREATE: "CREATE",
    READ: "READ",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
};
const POMO_DB = "pomodoroDB";
const PROJECT_DB = "projectDB";
const CALENDAR_DB = "calendarDB";
const POMO_STORAGE_PATH = path.join(dataPath, "pomoStorage.db");
const PROJECT_STORAGE_PATH = path.join(dataPath, "projectStorage.db");
const CALENDAR_STORAGE_PATH = path.join(dataPath, "calendarStorage.db");

const DBList = {
    [POMO_DB]: new sqlite3.Database(POMO_STORAGE_PATH, (err) => {
        if (err) console.log(err);
    }),
    [PROJECT_DB]: new sqlite3.Database(PROJECT_STORAGE_PATH, (err) => {
        if (err) console.log(err);
    }),
    [CALENDAR_DB]: new sqlite3.Database(CALENDAR_STORAGE_PATH, (err) => {
        if (err) console.log(err);
    }),
};

// const arg = {
//     access: "db",
//     target: db,
//     operation: "UD",
//     query: query,
//     changeList: changeList,
// };

ipcMain.on(IN_STREAM, (event, arg) => {
    if (arg.access === "db") {
        if (arg.operation === OPERATIONS.READ) {
            DBList[arg.target].all(arg.query, arg.changeList, (err, rows) => {
                if (err) {
                    console.log(err);
                    event.reply(OUT_STREAM, { error: err });
                }
                event.reply(OUT_STREAM, { data: rows });
            });
        } else {
            // arg.operation is CREATE, UPDATE or DELETE
            DBList[arg.target].run(arg.query, arg.changeList, function (err) {
                // "function" will give you "this" context unlike arrow function
                if (err) {
                    console.log(err);
                    event.reply(OUT_STREAM, { error: err });
                } else event.reply(OUT_STREAM, { data: "SUCCESS", lastID: this.lastID });
            });
        }
    } else event.reply(OUT_STREAM, { error: "Invalid access parameter" });
});

function close() {
    // close all opened DBs
    Object.keys(DBList).forEach((dbName) => DBList[dbName].close());
}

module.exports = { close };
