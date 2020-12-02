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
    if (callback) callback();
}

const listRows = (db, updateList) => {
    const query = `SELECT * FROM tasks;`;
    db.all(query, (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    })
}

const addRow = (db, row, callback) => {
    const query = `INSERT INTO tasks VALUES (NULL, ?, ?);`;
    db.run(query, [row.name, row.desc], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    })
}

const deleteRow = (db, id, callback) => {
    const query = `DELETE FROM tasks WHERE id=?;`;
    db.run(query, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    })
}

const editRow = (db, row, callback) => {
    const query = `UPDATE tasks SET name=?, desc=? WHERE id=?;`;
    db.run(query, [row.name, row.desc, row.id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    })
}

export {
    createDb,
    listRows,
    addRow,
    deleteRow,
    editRow,
};