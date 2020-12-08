import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSync } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";

import "./Calendar.css";
import Tooltip from "../../ui/Tooltip";
import Textbox from "../../ui/Textbox";
import CalendarItem from "./CalendarItem";
import WindowContext from "../../WindowContext";
import { openDatabase } from "../../Database";
import UserPreferences from "../../settings/UserPreferences";
import { createDb, listRows, addRow, deleteRow, editRow } from "./CalendarDB";

const style = {
    container: {
        height: "100%",
        padding: "0.2rem",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexFlow: "column",
    },
    header: {
        fontSize: "1.5rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
    },
    controls: {
        margin: "0 0.2rem",
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "space-evenly",
        borderTop: "2px solid var(--dividerColor)",
        borderBottom: "2px solid var(--dividerColor)",
    },
    controlItem: {
        padding: "0.3rem",
        cursor: "pointer",
    },
    calendarItems: {
        flex: "10",
    },
};

const CalendarNav = () => {
    let [calendarList, setCalendarList] = useState([]);
    let [textbox, setTextbox] = useState(false);
    let [openItem, setOpenItem] = useState(null); // currently open calendar
    const { closeWindow } = useContext(WindowContext);
    const db = openDatabase(UserPreferences.get("calendarStorage"));

    createDb(db, () => listRows(db));

    const createNewCalendar = (calendarName) => {
        const calendar = {
            name: calendarName,
            desc: "",
        };
        addRow(db, calendar, (err) => {
            if (err) return;
            listRows(db, setCalendarList);
            setTextbox(false);
        });
        return ""; // make the textbox empty
    };

    const handleRefresh = () => {
        listRows(db, setCalendarList);
    };

    const handleDelete = (calendarItem) => {
        deleteRow(db, calendarItem.id, (err) => {
            if (err) return;
            // close the window if open
            if (openItem && openItem.taskItem.id === calendarItem.id) {
                closeWindow(openItem);
                setOpenItem(null);
            }
            // TODO: re-fetching complete list is heavy. instead remove one from taskList directly
            // look at closeWindow function for info on how to get index
            listRows(db, setCalendarList);
        });
    };

    const handleEdit = (taskItem, newName) => {
        taskItem.name = newName;
        editRow(db, taskItem, (err) => {
            if (err) return;
            // TODO: re-fetching complete list is heavy. instead edit one from taskList directly
            // look at closeWindow function for info on how to get index
            listRows(db, setCalendarList);
        });
    };

    useEffect(() => {
        // on mount and unmount
        listRows(db, setCalendarList);
        return () => {
            db.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={style.container}>
            <div style={style.header}>Calendars</div>
            <div style={style.controls}>
                <div style={style.controlItem} onClick={() => setTextbox(true)}>
                    <Tooltip value="Add" position="bottom">
                        <FontAwesomeIcon icon={faPlus} />
                    </Tooltip>
                </div>
                <div style={style.controlItem} onClick={handleRefresh}>
                    <Tooltip value="Refresh" position="bottom">
                        <FontAwesomeIcon icon={faSync} />
                    </Tooltip>
                </div>
            </div>
            {textbox && (
                <Textbox
                    visible={textbox}
                    setVisible={setTextbox}
                    handleConfirm={createNewCalendar}
                    handleCancel={() => setTextbox(false)}
                    placeholder=" New Task "
                />
            )}
            <div style={style.calendarItems}>
                {calendarList.map((taskItem) => (
                    <div key={`${taskItem.id}`}>
                        <CalendarItem
                            setOpenTask={setOpenItem}
                            taskItem={taskItem}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                        />
                        <div className="divider" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarNav;
