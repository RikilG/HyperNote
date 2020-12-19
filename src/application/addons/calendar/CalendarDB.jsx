// database helper functions
import { toast } from "react-toastify";
// max no of tables sqlite allows is 64
// schema from: https://www.vertabelo.com/blog/again-and-again-managing-recurring-events-in-a-data-model/

const handleSqlError = (err) => {
    if (err) {
        toast.error(err);
        console.log(err);
    }
};

const runQuery = (query, db) => {
    db.run(query, (err) => handleSqlError(err));
};

const create = (db, callback) => {
    const queries = [
        // `CREATE TABLE IF NOT EXISTS calendars(
        //     id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     name TEXT,
        //     desc TEXT
        // );`,
        `CREATE TABLE IF NOT EXISTS events(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            title TEXT NOT NULL,
            description TEXT,
            start_date TEXT NOT NULL,
            end_date TEXT,
            start_time TEXT,
            end_time TEXT,
            created_date TEXT,
            is_full_day BOOLEAN NOT NULL,
            is_recurring BOOLEAN NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS recurring_type(
            id INTEGER PRIMARY KEY,
            recurring_type TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS recurring_pattern(
            event_id INTEGER PRIMARY KEY NOT NULL,
            recurring_type_id INTEGER REFERENCES recurring_type(id),
            separation_count INTEGER,
            max_occurrences INTEGER,
            day_of_week INTEGER,
            week_of_month INTEGER,
            day_of_month INTEGER,
            month_of_year INTEGER,
            FOREIGN KEY(event_id) REFERENCES events(id)
        );`,
    ];
    for (let i in queries) {
        // run each query
        runQuery(queries[i], db);
    }
    setTimeout(() => {
        runQuery(
            `INSERT OR IGNORE INTO recurring_type VALUES
                (1, "daily"), (2, "weekly"), (3, "monthly"), (4, "yearly");
            `,
            db
        );
    }, 500);
    if (callback) callback();
};

const listRows = (db, updateList) => {
    const query = `SELECT * FROM calendars;`;
    db.all(query, (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const addRow = (db, row, callback) => {
    const query = `INSERT INTO calendars VALUES (NULL, ?, ?);`;
    db.run(query, [row.name, row.desc], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const deleteRow = (db, id, callback) => {
    const query = `DELETE FROM calendars WHERE id=?;`;
    db.run(query, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const editRow = (db, row, callback) => {
    const query = `UPDATE calendars SET name=?, desc=? WHERE id=?;`;
    db.run(query, [row.name, row.desc, row.id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const CalendarDB = { create, listRows, addRow, deleteRow, editRow };
export default CalendarDB;
