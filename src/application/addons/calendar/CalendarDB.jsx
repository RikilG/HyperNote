// database helper functions
import { toast } from "react-toastify";
// max no of tables sqlite allows is 64
// schema from: https://www.vertabelo.com/blog/again-and-again-managing-recurring-events-in-a-data-model/

const recurID = {
    daily: 1,
    weekly: 2,
    monthly: 3,
    yearly: 4,
};
let db = null;

const resetTime = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
};

const utcDate = (date) => {
    if (typeof date === "string") date = new Date(date);
    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
};

const toDateStr = (dateObj) => {
    if (!dateObj) return null; // if dateObj is null
    const dateUTC = utcDate(dateObj);
    return dateUTC.toISOString().slice(0, 10);
};

const handleSqlError = (err) => {
    if (err) {
        toast.error(err);
        console.log(err);
    }
};

const runQuery = (query) => {
    db.run(query, (err) => handleSqlError(err));
};

const create = (dbObj, callback) => {
    db = dbObj;
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
            is_all_day BOOLEAN NOT NULL,
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
        runQuery(queries[i]);
    }
    setTimeout(() => {
        runQuery(
            `INSERT OR IGNORE INTO recurring_type VALUES
                (1, "daily"), (2, "weekly"), (3, "monthly"), (4, "yearly");
            `
        );
    }, 500);
    if (callback) callback();
};

const saveEvent = (event, callback) => {
    // id title description start_date end_date start_time end_time
    // created_date is_all_day is_recurring
    const now = new Date();
    const query = `INSERT INTO events VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    db.run(
        query,
        [
            event.eventName,
            event.description,
            toDateStr(event.startDate),
            toDateStr(event.endDate),
            event.startTime,
            event.endTime,
            toDateStr(now),
            event.allDay,
            event.recurrence !== "norepeat",
        ],
        function (err) {
            // arrow function will not give you "this" to get id
            if (err) handleSqlError(err);

            if (event.recurrence === "norepeat" || err) {
                // no recurrence
                if (callback) callback(err);
                return;
            }

            // event_id recurring_type_id separation_count max_occurrences day_of_week week_of_month day_of_month month_of_year
            const eventID = this.lastID;
            const recQuery = `INSERT INTO recurring_pattern VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
            db.run(
                recQuery,
                [
                    eventID,
                    recurID[event.recurrence],
                    event.separation,
                    null,
                    // TODO: make these fields useful
                    event.startDate.getDay(),
                    null, // TODO: week of month
                    event.startDate.getDate(),
                    event.startDate.getMonth() + 1,
                ],
                function (err) {
                    handleSqlError(err);
                    if (callback) callback(err);
                }
            );
        }
    );
};

const getEventsOn = (date, callback) => {
    if (typeof date === "string") date = new Date(date);
    date = resetTime(date); // TODO: we don't care about time! for now. don't know if it requres changes
    const strDate = toDateStr(date);
    // non-recurring
    const query = `SELECT * FROM events WHERE ((date(?) BETWEEN start_date AND end_date) OR (start_date=date(?))) AND is_recurring=0;`;
    // recurring
    const recQuery = `SELECT * FROM recurring_pattern join events on events.id=recurring_pattern.event_id where start_date<=date(?);`;

    db.all(query, [strDate, strDate], (err, rows) => {
        handleSqlError(err);
        if (!rows || err) return;
        db.all(recQuery, [strDate], (err, recRows) => {
            handleSqlError(err);
            if (!recRows || err) return;
            // process recurring events
            recRows = recRows.filter((event) => {
                const eventStart = resetTime(new Date(event.start_date));
                const eventEnd = event.end_date
                    ? resetTime(new Date(event.end_date))
                    : date;
                // validation conditions according to recurring type
                if (event.recurring_type_id === 1) {
                    // daily
                    if (
                        ((date - eventStart) / (1000 * 60 * 60 * 24)) %
                            (1 + event.separation_count) !==
                        0
                    )
                        return false; // separation condition not satisfied
                } else if (event.recurring_type_id === 2) {
                    // weekly
                    if (
                        ((date - eventStart) / (1000 * 60 * 60 * 24 * 7)) %
                            (1 + event.separation_count) !==
                        0
                    ) {
                        return false; // separation condition not satisfied
                    }
                } else if (event.recurring_type_id === 3) {
                    // monthly
                    const diff =
                        date.getMonth() -
                        eventStart.getMonth() +
                        (date.getFullYear() - eventStart.getFullYear()) * 12;
                    if (
                        date.getDate() !== eventStart.getDate() ||
                        diff % (1 + event.separation_count) !== 0
                    )
                        return false;
                } else if (event.recurring_type_id === 4) {
                    // yearly
                    if (eventStart.getFullYear() === eventEnd.getFullYear()) {
                        // event container in one year
                        if (
                            (date.getFullYear() - eventStart.getFullYear()) %
                                (1 + event.separation_count) !==
                            0
                        )
                            return false; // separation condition not satisfied
                        eventStart.setFullYear(date.getFullYear());
                        eventEnd.setFullYear(date.getFullYear());
                    } else {
                        // TODO: make use of separation also!
                        // event spans across the start/end of year
                        if (date.getMonth() >= 0 && date.getDate() >= 1) {
                            eventStart.setFullYear(date.getFullYear() - 1);
                            eventEnd.setFullYear(date.getFullYear());
                        } else {
                            eventStart.setFullYear(date.getFullYear());
                            eventEnd.setFullYear(date.getFullYear() + 1);
                        }
                    }
                }
                if (date >= eventStart && date <= eventEnd) {
                    return true;
                }
                return false;
            });

            if (callback) callback([...rows, ...recRows]);
        });
    });
};

const deleteEvent = (event, callback) => {
    const query = `DELETE FROM events WHERE id=?;`;
    const query2 = `DELETE FROM recurring_pattern WHERE event_id=?;`;
    db.run(query, [event.id], (err) => {
        handleSqlError(err);
    }).run(query2, [event.id], (err) => {
        handleSqlError(err);
        if (callback) callback(err);
    });
};

const editEvent = (event, callback) => {
    // id title description start_date end_date start_time end_time
    // created_date is_all_day is_recurring
    const now = new Date();
    const query = `UPDATE events SET 
        title=?,
        description=?,
        start_date=?,
        end_date=?,
        start_time=?,
        end_time=?,
        created_date=?,
        is_all_day=?,
        is_recurring=?
        WHERE id=?;`;
    db.run(
        query,
        [
            event.eventName,
            event.description,
            toDateStr(event.startDate),
            toDateStr(event.endDate),
            event.startTime,
            event.endTime,
            toDateStr(now),
            event.allDay,
            event.recurrence !== "norepeat",
            event.id,
        ],
        function (err) {
            handleSqlError(err);
            if (err) {
                if (callback) callback(err);
                return;
            }

            if (event.recurrence === "norepeat") {
                // no recurrence
                const delQuery = `DELETE FROM recurring_pattern WHERE event_id=?;`;
                db.run(delQuery, [event.id], (err) => {
                    handleSqlError(err);
                    if (callback) callback(err);
                });
                return;
            }

            const recQuery = `UPDATE recurring_pattern SET
                recurring_type_id=?,
                separation_count=?,
                max_occurrences=?,
                day_of_week=?,
                week_of_month=?,
                day_of_month=?,
                month_of_year=?
                WHERE event_id=?;`;
            db.run(
                recQuery,
                [
                    recurID[event.recurrence],
                    event.separation,
                    null,
                    // TODO: make these fields useful
                    event.startDate.getDay(),
                    null, // TODO: week of month
                    event.startDate.getDate(),
                    event.startDate.getMonth() + 1,
                    event.id,
                ],
                function (err) {
                    handleSqlError(err);
                    if (callback) callback(err);
                }
            );
        }
    );
};

const CalendarDB = { create, saveEvent, getEventsOn, deleteEvent, editEvent };
export default CalendarDB;
