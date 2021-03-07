import { toast } from "react-toastify";

import { sendBackendAsync, CALENDAR_DB } from "../../Database";
import { monthToDays } from "./CalendarPage";
// max no of tables sqlite allows is 64
// schema from: https://www.vertabelo.com/blog/again-and-again-managing-recurring-events-in-a-data-model/

const recurID = {
    daily: 1,
    weekly: 2,
    monthly: 3,
    yearly: 4,
};

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

const handleError = (err) => {
    if (err) {
        toast.error(err);
        console.log(err);
    }
};

const __runQuery = async (args) => {
    const props = {
        access: "db",
        target: CALENDAR_DB,
        query: args.query,
        operation: args.operation,
        changeList: args.changeList,
    };
    return await sendBackendAsync(props); // A Promise
};

const create = async (callback) => {
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
        const res = await __runQuery({
            operation: "CREATE",
            query: queries[i],
        });
        handleError(res.error);
    }
    const res = await __runQuery({
        operation: "UPDATE",
        query: `INSERT OR IGNORE INTO recurring_type VALUES
            (1, "daily"), (2, "weekly"), (3, "monthly"), (4, "yearly");
        `,
    });
    handleError(res.error);
    if (callback) callback();
};

const saveEvent = async (event, callback) => {
    // id title description start_date end_date start_time end_time
    // created_date is_all_day is_recurring
    const now = new Date();
    const query = `INSERT INTO events VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const changeList = [
        event.eventName,
        event.description,
        toDateStr(event.startDate),
        toDateStr(event.endDate),
        event.startTime,
        event.endTime,
        toDateStr(now),
        event.allDay,
        event.recurrence !== "norepeat",
    ];
    const res = await __runQuery({
        operation: "UPDATE",
        query: query,
        changeList: changeList,
    });
    handleError(res.error);

    if (event.recurrence === "norepeat" || res.error) {
        // no recurrence
        if (callback) callback(res.err);
        return;
    }

    // event_id recurring_type_id separation_count max_occurrences day_of_week week_of_month day_of_month month_of_year
    const recQuery = `INSERT INTO recurring_pattern VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    const recChangeList = [
        res.lastID,
        recurID[event.recurrence],
        event.separation,
        null,
        // TODO: make these fields useful
        event.startDate.getDay(),
        null, // TODO: week of month
        event.startDate.getDate(),
        event.startDate.getMonth() + 1,
    ];
    const recRes = await __runQuery({
        operation: "UPDATE",
        query: recQuery,
        changeList: recChangeList,
    });
    handleError(recRes.error);
    if (callback) callback(recRes.error);
};

const occursToday = (event, date) => {
    const eventStart = resetTime(new Date(event.start_date));
    // validation conditions according to recurring type
    if (date < eventStart) return false;
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
        // if eventEnd is really the end of event span, and not where the recurrence stops:
        // if (eventStart.getFullYear() === eventEnd.getFullYear()) {
        //     // event container in one year
        //     if (
        //         (date.getFullYear() - eventStart.getFullYear()) %
        //             (1 + event.separation_count) !==
        //         0
        //     )
        //         return false; // separation condition not satisfied
        //     eventStart.setFullYear(date.getFullYear());
        //     eventEnd.setFullYear(date.getFullYear());
        // } else {
        //     // TODO: make use of separation also!
        //     // event spans across the start/end of year
        //     if (date.getMonth() >= 0 && date.getDate() >= 1) {
        //         eventStart.setFullYear(date.getFullYear() - 1);
        //         eventEnd.setFullYear(date.getFullYear());
        //     } else {
        //         eventStart.setFullYear(date.getFullYear());
        //         eventEnd.setFullYear(date.getFullYear() + 1);
        //     }
        // }
        if (
            (date.getFullYear() - eventStart.getFullYear()) %
                (1 + event.separation_count) !==
                0 ||
            date.getDate() !== eventStart.getDate() ||
            date.getMonth() !== eventStart.getMonth()
        )
            return false; // separation condition not satisfied
    }
    return true;
};

const getEventsOn = async (date, callback) => {
    if (typeof date === "string") date = new Date(date);
    date = resetTime(date); // TODO: we don't care about time! for now. don't know if it requres changes
    const strDate = toDateStr(date);
    // non-recurring
    const query = `SELECT * FROM events WHERE ((date(?) BETWEEN start_date AND end_date) OR (start_date=date(?))) AND is_recurring=0;`;
    // recurring
    // TODO: after we differentiate end_date with event_end_date/span, replace
    // end_date here with that new var
    const recQuery = `SELECT * FROM recurring_pattern join events on events.id=recurring_pattern.event_id where start_date<=date(?) AND (end_date IS NULL OR end_date>=date(?));`;

    const res = await __runQuery({
        operation: "READ",
        query: query,
        changeList: [strDate, strDate],
    });
    handleError(res.error);
    if (!res.data || res.error) return;
    // TODO: differentiate end_date with event_end_date/span
    // by using no of occurences (infinite if no end to repeat)
    const recRes = await __runQuery({
        operation: "READ",
        query: recQuery,
        changeList: [strDate, strDate],
    });
    handleError(recRes.error);
    if (!recRes.data || recRes.error || typeof recRes.data === "string") return;
    const recEvents = recRes.data.filter((event) => {
        return occursToday(event, date);
    });
    if (callback) callback([...res.data, ...recEvents]);
};

const getMonthEvents = async (date, callback) => {
    const lastDate = monthToDays(date.getMonth());
    if (typeof date === "string") date = new Date(date);
    date.setDate(1);
    date = resetTime(date); // TODO: we don't care about time! for now. don't know if it requres changes
    const monthStartStr = toDateStr(date);
    const monthEndStr = toDateStr(
        new Date(date.getFullYear(), date.getMonth(), lastDate)
    );
    // non-recurring
    const query = `SELECT * FROM events WHERE ((start_date BETWEEN date(?) AND date(?)) OR (end_date BETWEEN date(?) AND date(?))) AND is_recurring=0;`;
    // recurring
    // TODO: after we differentiate end_date with event_end_date/span, replace
    // end_date here with that new var
    const recQuery = `SELECT * FROM recurring_pattern join events on events.id=recurring_pattern.event_id where start_date<=date(?) AND (end_date IS NULL OR end_date>=date(?));`;

    let monthEvents = {};
    for (let i = 1; i <= lastDate; i++) {
        monthEvents[i] = [];
    }

    const res = await __runQuery({
        operation: "READ",
        query: query,
        changeList: [monthStartStr, monthEndStr, monthStartStr, monthEndStr],
    });
    handleError(res.error);
    if (!res.data || res.error) return;
    // TODO: differentiate end_date with event_end_date/span
    // by using no of occurences (infinite if no end to repeat)
    const recRes = await __runQuery({
        operation: "READ",
        query: recQuery,
        changeList: [monthEndStr, monthStartStr],
    });
    handleError(recRes.error);
    if (!recRes.data || recRes.error) return;
    // process non-recurring events
    if (typeof res.data === "string") {
        toast.warn("Invalid response detected");
        return;
    }
    res.data.forEach((event) => {
        const stDate = resetTime(new Date(event.start_date));
        const endDate = event.end_date && resetTime(new Date(event.end_date));
        if (stDate.getMonth() === date.getMonth()) {
            // start date in this month
            if (endDate) {
                // if endDate exists
                for (let i = stDate.getDate(); i <= endDate.getDate(); i++) {
                    monthEvents[i].push(event);
                }
            } else {
                monthEvents[stDate.getDate()].push(event);
            }
        } else {
            // endDate exists in this month
            for (let i = 1; i <= endDate.getDate(); i++) {
                monthEvents[i].push(event);
            }
        }
    });
    // process recurring events
    if (typeof recRes.data === "string") {
        toast.warn("Got Invalid data");
        return;
    }
    recRes.data.forEach((event) => {
        let iterDate = resetTime(new Date(date));
        for (let i = 1; i <= lastDate; i++) {
            iterDate.setDate(i);
            if (occursToday(event, iterDate)) {
                // console.log(iterDate.getDate(), event);
                monthEvents[i].push(event);
                if (
                    event.recurring_type_id === 4 ||
                    event.recurring_type_id === 3
                )
                    break; // these events come only once
            }
        }
    });

    if (callback) callback(monthEvents);
};

const deleteEvent = async (event, callback) => {
    const query = `DELETE FROM events WHERE id=?;`;
    const query2 = `DELETE FROM recurring_pattern WHERE event_id=?;`;
    const res = await __runQuery({
        operation: "DELETE",
        query: query,
        changeList: [event.id],
    });
    handleError(res.error);
    const res2 = await __runQuery({
        operation: "DELETE",
        query: query2,
        changeList: [event.id],
    });
    handleError(res2.error);
    if (callback) callback(res2.err);
};

const editEvent = async (event, callback) => {
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
    const changeList = [
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
    ];
    const res = await __runQuery({
        operation: "UPDATE",
        query: query,
        changeList: changeList,
    });
    handleError(res.error);
    if (res.err) {
        if (callback) callback(res.err);
        return;
    }
    if (event.recurrence === "norepeat") {
        // no recurrence
        const delQuery = `DELETE FROM recurring_pattern WHERE event_id=?;`;
        const delRes = await __runQuery({
            operation: "DELETE",
            query: delQuery,
            changeList: [event.id],
        });
        handleError(delRes.error);
        if (callback) callback(delRes.error);
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
    const recChangeList = [
        recurID[event.recurrence],
        event.separation,
        null,
        // TODO: make these fields useful
        event.startDate.getDay(),
        null, // TODO: week of month
        event.startDate.getDate(),
        event.startDate.getMonth() + 1,
        event.id,
    ];
    const recRes = await __runQuery({
        operation: "UPDATE",
        query: recQuery,
        changeList: recChangeList,
    });
    handleError(recRes.error);
    if (callback) callback(recRes.error);
};

const CalendarDB = {
    create,
    saveEvent,
    getEventsOn,
    deleteEvent,
    editEvent,
    getMonthEvents,
};
export default CalendarDB;
