// database helper functions
import { sendBackendCallback, POMO_DB } from "../../storage/Database";

const createDb = (callback) => {
    const query = `CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT,
        desc TEXT,
        duration INTEGER,
        tickingSound BOOLEAN,
        ringingSound BOOLEAN
    );`;
    const props = {
        access: "db",
        target: POMO_DB,
        operation: "CREATE",
        query: query,
    };
    sendBackendCallback(props, callback);
};

const listRows = (callback) => {
    const query = `SELECT * FROM tasks;`;
    const props = {
        access: "db",
        target: POMO_DB,
        operation: "READ",
        query: query,
    };
    sendBackendCallback(props, callback);
};

const addRow = (row, callback) => {
    const query = `INSERT INTO tasks VALUES (NULL, ?, ?, ?, ?, ?);`;
    const changeList = [
        row.name,
        row.desc,
        row.duration,
        row.tickingSound,
        row.ringingSound,
    ];
    const props = {
        access: "db",
        target: POMO_DB,
        operation: "UPDATE",
        query: query,
        changeList: changeList,
    };
    sendBackendCallback(props, callback);
};

const deleteRow = (id, callback) => {
    const query = `DELETE FROM tasks WHERE id=?;`;
    const changeList = [id];
    const props = {
        access: "db",
        target: POMO_DB,
        operation: "DELETE",
        query: query,
        changeList: changeList,
    };
    sendBackendCallback(props, callback);
};

const editRow = (row, callback) => {
    const query = `UPDATE tasks SET name=?, desc=?, duration=?, tickingSound=?, ringingSound=? WHERE id=?;`;
    const changeList = [
        row.name,
        row.desc,
        row.duration,
        row.tickingSound,
        row.ringingSound,
        row.id,
    ];
    console.log(row);
    const props = {
        access: "db",
        target: POMO_DB,
        operation: "UPDATE",
        query: query,
        changeList: changeList,
    };
    sendBackendCallback(props, callback);
};

export { createDb, listRows, addRow, deleteRow, editRow };
