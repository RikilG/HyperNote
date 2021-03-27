import { toast } from "react-toastify";
import { Mutex } from "async-mutex";
const ipcRenderer = window.isElectron && window.require("electron").ipcRenderer;

export const POMO_DB = "pomodoroDB";
export const PROJECT_DB = "projectDB";
export const CALENDAR_DB = "calendarDB";

export const OPERATIONS = {
    CREATE: "CREATE",
    READ: "READ",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
};

const mutexLock = new Mutex();

export const sendBackendAsync = async (props) => {
    return mutexLock.runExclusive(async () => {
        return new Promise((resolve) => {
            ipcRenderer.once("asynchronous-reply", (_, arg) => {
                resolve(arg);
            });
            ipcRenderer.send("asynchronous-message", props);
        });
    });
};

export const sendBackendCallback = (props, callback) => {
    sendBackendAsync(props).then((res) => {
        if (res.error) {
            toast.error(res.error);
            console.log(res.error);
        }
        if (callback) callback(res.error, res.data);
    });
};

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
