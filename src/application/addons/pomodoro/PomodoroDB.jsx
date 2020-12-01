// database helper functions
import { toast } from 'react-toastify';

const handleSqlError = (err) => {
    if (err) {
        toast.error(err);
        console.log(err);
    }
}

const runQuery = (query, db) => {
    db.run(query, (err) => handleSqlError(err));
}

const createDb = (db, callback) => {
    const query = `CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT,
        desc TEXT
    );`;
    runQuery(query, db);
    callback();
}

const listRows = (db, updateList) => {
    const query = `SELECT name FROM tasks;`;
    db.all(query, (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows.map((row) => row.name));
    })
}

const addRow = (db, row, callback) => {
    const query = `INSERT INTO tasks VALUES (NULL, ?, ?);`;
    db.run(query, [row.name, row.desc], (err) => {
        handleSqlError(err);
        callback(err);
    })
}

export {
    createDb,
    listRows,
    addRow,
};