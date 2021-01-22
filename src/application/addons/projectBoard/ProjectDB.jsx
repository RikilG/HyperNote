// database helper functions
import { toast } from "react-toastify";

const handleSqlError = (err) => {
    if (err) {
        toast.error(err);
        console.log(err);
    }
};

const runQuery = (query, db) => {
    db.run(query, (err) => handleSqlError(err));
};

const createProjectsDb = (db, callback) => {
    const query = `CREATE TABLE IF NOT EXISTS projects(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT
    );`;
    runQuery(query, db);
    if (callback) callback();
};

const createBoardsDb = (db, callback) => {
    const query = `CREATE TABLE IF NOT EXISTS boards(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        projectID INTEGER,
        name TEXT
    );`;
    runQuery(query, db);
    if (callback) callback();
};

const createTilesDb = (db, callback) => {
    const query = `CREATE TABLE IF NOT EXISTS tiles(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        boardID INTEGER,
        name TEXT,
        desc TEXT,
        dueDate TEXT,
        link TEXT
    );`;
    runQuery(query, db);
    if (callback) callback();
};

const createChecklistsDb = (db, callback) => {
    const query = `CREATE TABLE IF NOT EXISTS checklists(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        tileID INTEGER,
        desc TEXT,
        checked INTEGER
    );`;
    runQuery(query, db);
    if (callback) callback();
};

const listProjectRows = (db, updateList) => {
    const query = `SELECT * FROM projects;`;
    db.all(query, (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const listBoardNames = (db, updateList, projectID) => {
    const query = `SELECT id,name FROM boards WHERE projectID=?;`;
    db.all(query, [projectID], (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const listBoardRows = (db, updateList, id) => {
    const query = `SELECT * FROM boards WHERE id=?;`;
    db.each(query, [id], (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const listTileNames = (db, updateList, boardID) => {
    const query = `SELECT id,name FROM tiles WHERE boardID=?;`;
    db.all(query, [boardID], (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const listTileRows = (db, updateList, id) => {
    const query = `SELECT * FROM tiles WHERE id=?;`;
    db.each(query, [id], (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const listChecklistRows = (db, updateList, tileID) => {
    const query = `SELECT * FROM checklists WHERE tileID=?;`;
    db.all(query, [tileID], (err, rows) => {
        handleSqlError(err);
        if (!rows) return;
        if (updateList) updateList(rows);
    });
};

const addProjectRow = (db, row, callback) => {
    const query = `INSERT INTO projects VALUES (NULL, ?);`;
    db.run(query, [row.name], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const addBoardRow = (db, row, callback) => {
    const query = `INSERT INTO boards VALUES (NULL, ?, ?);`;
    db.run(query, [row.projectID, row.name], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const addTileRow = (db, row, callback) => {
    const query = `INSERT INTO tiles VALUES (NULL, ?, ?, ?, ?, ?);`;
    db.run(
        query,
        [row.boardID, row.name, row.desc, row.dueDate, row.link],
        (err) => {
            handleSqlError(err);
            if (callback) callback(err);
        }
    );
};

const addChecklistRow = (db, row, callback) => {
    const query = `INSERT INTO checklists VALUES (NULL, ?, ?, ?);`;
    db.run(query, [row.tileID, row.desc, row.checked], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const deleteProjectRow = (db, id, callback) => {
    const query1 = `DELETE FROM checklists WHERE tileID IN (SELECT id FROM tiles WHERE boardID IN (SELECT id FROM boards WHERE projectID=?));`;
    db.run(query1, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
    const query2 = `DELETE FROM tiles WHERE boardID IN (SELECT id FROM boards WHERE projectID=?);`;
    db.run(query2, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
    const query3 = `DELETE FROM boards WHERE projectID=?;`;
    db.run(query3, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
    const query4 = `DELETE FROM projects WHERE id=?;`;
    db.run(query4, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const deleteBoardRow = (db, id, callback) => {
    const query1 = `DELETE FROM checklists WHERE tileID IN (SELECT id FROM tiles WHERE boardID=?);`;
    db.run(query1, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
    const query2 = `DELETE FROM tiles WHERE boardID=?;`;
    db.run(query2, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
    const query3 = `DELETE FROM boards WHERE id=?;`;
    db.run(query3, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const deleteTileRow = (db, id, callback) => {
    const query1 = `DELETE FROM checklists WHERE tileID=?;`;
    db.run(query1, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
    const query2 = `DELETE FROM tiles WHERE id=?;`;
    db.run(query2, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const deleteChecklistRow = (db, id, callback) => {
    const query = `DELETE FROM checklists WHERE id=?;`;
    db.run(query, [id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const editProjectRow = (db, row, callback) => {
    const query = `UPDATE projects SET name=? WHERE id=?;`;
    db.run(query, [row.name, row.id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const editBoardRow = (db, row, callback) => {
    const query = `UPDATE boards SET name=? WHERE id=?;`;
    db.run(query, [row.name, row.id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const editTileRow = (db, row, callback) => {
    const query = `UPDATE tiles SET name=?, desc=?, dueDate=?, link=? WHERE id=?;`; // assume tiles can be moved between boards
    db.run(
        query,
        [row.name, row.desc, row.dueDate, row.link, row.id],
        (err) => {
            handleSqlError(err);
            if (callback) callback(err);
        }
    );
};

const editChecklistRow = (db, row, callback) => {
    const query = `UPDATE checklists SET tileID=?, desc=?, checked=? WHERE id=?;`; //add check
    db.run(query, [row.tileID, row.desc, row.checked, row.id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

export {
    createProjectsDb,
    listProjectRows,
    addProjectRow,
    deleteProjectRow,
    editProjectRow,
    createBoardsDb,
    listBoardNames,
    listBoardRows,
    addBoardRow,
    deleteBoardRow,
    editBoardRow,
    createTilesDb,
    listTileNames,
    listTileRows,
    addTileRow,
    deleteTileRow,
    editTileRow,
    createChecklistsDb,
    listChecklistRows,
    addChecklistRow,
    deleteChecklistRow,
    editChecklistRow,
};
