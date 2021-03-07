// database helper functions
import { toast } from "react-toastify";
import { PROJECT_DB, sendBackendAsync, OPERATIONS } from "../../Database";

const handleError = (err) => {
    if (err) {
        toast.error(err);
        console.log(err);
    }
};

const runQuery = async (query, operation, changeList) => {
    const props = {
        access: "db",
        target: PROJECT_DB,
        query: query,
        operation: operation,
        changeList: changeList,
    };
    const { error, data } = await sendBackendAsync(props); // A Promise
    handleError(error);
    return { error, data };
};

export const createDb = async (callback) => {
    const queries = [
        `CREATE TABLE IF NOT EXISTS projects(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            name TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS boards(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            projectID INTEGER,
            name TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS tiles(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            boardID INTEGER,
            name TEXT,
            desc TEXT,
            dueDate TEXT,
            link TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS checklists(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            tileID INTEGER,
            desc TEXT,
            checked INTEGER
        );`,
    ];
    for (let i = 0; i < queries.length; i++) {
        const { err } = await runQuery(queries[i], OPERATIONS.CREATE);
        if (err && callback) callback(err); // exec only on err
    }
    if (callback) callback(); // exec once when no error
};

export const listProjectRows = async (updateList) => {
    const query = `SELECT * FROM projects;`;
    const { data } = await runQuery(query, OPERATIONS.READ);
    if (updateList) updateList(data);
};

export const listBoards = async (updateList, projectID) => {
    const query = `SELECT * FROM boards WHERE projectID=?;`;
    const { data } = await runQuery(query, OPERATIONS.READ, [projectID]);
    if (updateList) updateList(data);
};

export const listTiles = async (updateList, boardID) => {
    const query = `SELECT * FROM tiles WHERE boardID=?;`;
    const { data } = await runQuery(query, OPERATIONS.READ, [boardID]);
    if (updateList) updateList(data);
};

export const listChecklistRows = async (updateList, tileID) => {
    const query = `SELECT * FROM checklists WHERE tileID=?;`;
    const { data } = await runQuery(query, OPERATIONS.READ, [tileID]);
    if (updateList) updateList(data);
};

export const addProjectRow = async (row, callback) => {
    const query = `INSERT INTO projects VALUES (NULL, ?);`;
    const { err } = await runQuery(query, OPERATIONS.UPDATE, [row.name]);
    if (callback) callback(err);
};

export const addBoard = async (row, callback) => {
    const query = `INSERT INTO boards VALUES (NULL, ?, ?);`;
    const { err } = await runQuery(query, OPERATIONS.UPDATE, [
        row.projectID,
        row.name,
    ]);
    if (callback) callback(err);
};

export const addTileRow = async (row, callback) => {
    const query = `INSERT INTO tiles VALUES (NULL, ?, ?, ?, ?, ?);`;
    const changeList = [row.boardID, row.name, row.desc, row.dueDate, row.link];
    const { err } = await runQuery(query, OPERATIONS.UPDATE, changeList);
    if (callback) callback(err);
};

export const addChecklistRow = async (row, callback) => {
    const query = `INSERT INTO checklists VALUES (NULL, ?, ?, ?);`;
    const changeList = [row.tileID, row.desc, row.checked];
    const { err } = await runQuery(query, OPERATIONS.UPDATE, changeList);
    if (callback) callback(err);
};

export const deleteProjectRow = async (id, callback) => {
    const queries = [
        `DELETE FROM checklists WHERE tileID IN (SELECT id FROM tiles WHERE boardID IN (SELECT id FROM boards WHERE projectID=?));`,
        `DELETE FROM tiles WHERE boardID IN (SELECT id FROM boards WHERE projectID=?);`,
        `DELETE FROM boards WHERE projectID=?;`,
        `DELETE FROM projects WHERE id=?;`,
    ];
    for (let i = 0; i < queries.length; i++) {
        const { err } = await runQuery(queries[i], OPERATIONS.DELETE, [id]);
        if (err && callback) callback(err); // exec only on err
    }
    if (callback) callback(); // exec once when no error
};

export const deleteBoard = async (id, callback) => {
    const queries = [
        `DELETE FROM checklists WHERE tileID IN (SELECT id FROM tiles WHERE boardID=?);`,
        `DELETE FROM tiles WHERE boardID=?;`,
        `DELETE FROM boards WHERE id=?;`,
    ];
    for (let i = 0; i < queries.length; i++) {
        const { err } = await runQuery(queries[i], OPERATIONS.DELETE, [id]);
        if (err && callback) callback(err); // exec only on err
    }
    if (callback) callback(); // exec once when no error
};

export const deleteTileRow = async (id, callback) => {
    const queries = [
        `DELETE FROM checklists WHERE tileID=?;`,
        `DELETE FROM tiles WHERE id=?;`,
    ];
    for (let i = 0; i < queries.length; i++) {
        const { err } = await runQuery(queries[i], OPERATIONS.DELETE, [id]);
        if (err && callback) callback(err); // exec only on err
    }
    if (callback) callback(); // exec once when no error
};

export const deleteChecklistRow = async (id, callback) => {
    const query = `DELETE FROM checklists WHERE id=?;`;
    const { err } = await runQuery(query, OPERATIONS.DELETE, [id]);
    if (callback) callback(err);
};

export const editProjectRow = async (row, callback) => {
    const query = `UPDATE projects SET name=? WHERE id=?;`;
    const { err } = await runQuery(query, OPERATIONS.UPDATE, [
        row.name,
        row.id,
    ]);
    if (callback) callback(err);
};

export const editBoard = async (row, callback) => {
    const query = `UPDATE boards SET name=? WHERE id=?;`;
    const { err } = await runQuery(query, OPERATIONS.UPDATE, [
        row.name,
        row.id,
    ]);
    if (callback) callback(err);
};

export const editTileRow = async (row, callback) => {
    const query = `UPDATE tiles SET name=?, desc=?, dueDate=?, link=? WHERE id=?;`;
    const changeList = [row.name, row.desc, row.dueDate, row.link, row.id];
    const { err } = await runQuery(query, OPERATIONS.UPDATE, changeList);
    if (callback) callback(err);
};

export const editTileBoard = async (row, callback) => {
    const query = `UPDATE tiles SET boardID=? WHERE id=?;`; // assume tiles can be moved between boards
    const { err } = await runQuery(query, OPERATIONS.UPDATE, [
        row.boardID,
        row.id,
    ]);
    if (callback) callback(err);
};

export const editChecklistRow = async (row, callback) => {
    const query = `UPDATE checklists SET tileID=?, desc=?, checked=? WHERE id=?;`; //add check
    const changeList = [row.tileID, row.desc, row.checked, row.id];
    const { err } = await runQuery(query, OPERATIONS.UPDATE, changeList);
    if (callback) callback(err);
};
