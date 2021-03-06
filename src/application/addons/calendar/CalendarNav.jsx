import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faSync,
    faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";

import "./Calendar.css";
import Tooltip from "../../ui/Tooltip";
import CalendarPage from "./CalendarPage";
import CalendarItem from "./CalendarItem";
import ModalNewEvent from "./ModalNewEvent";
import WindowContext from "../../WindowContext";
import CalendarDB from "./CalendarDB";

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
    headerBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    button: {
        padding: "0.2rem 0.5rem",
        cursor: "pointer",
        marginRight: "0.7rem",
        background: "var(--primaryColor)",
        borderRadius: "0.2rem",
    },
    date: {
        fontSize: "1rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
        background: "var(--backgroundAccent)",
        margin: "0.1rem",
        borderRadius: "0.3rem",
        fontWeight: "bold",
        textAlign: "center",
        paddingRight: "0.3rem",
    },
    comment: {
        fontStyle: "italic",
        textAlign: "center",
        padding: "1rem",
        color: "var(--dividerColor)",
        userSelect: "none",
    },
};

const CalendarNav = () => {
    let [curDate, setCurDate] = useState(Date());
    let [showModal, setShowModal] = useState(false);
    let [editEvent, setEditEvent] = useState(null);
    let [events, setEvents] = useState([]);
    const { openWindow } = useContext(WindowContext);
    let [winObj, setWinObj] = useState({
        addon: "calendar",
        id: "calendar/default-0",
        page: undefined,
        changeSelection: () => {},
        getMonthEvents: CalendarDB.getMonthEvents,
    });

    const handleRefresh = () => {
        changeSelection(curDate);
    };

    const toggleCalendar = () => {
        openWindow(winObj, true);
    };

    const changeSelection = (newDate, callback) => {
        // called via CalendarPage when user selects a date
        setCurDate(newDate);
        CalendarDB.getEventsOn(newDate, (newEvents) => {
            setEvents(newEvents);
            if (callback) callback();
        });
    };

    const handleDelete = (event) => {
        CalendarDB.deleteEvent(event, () => handleRefresh());
    };

    useEffect(() => {
        // on mount and unmount
        CalendarDB.create(() => {
            // changeSelection(curDate);
            setWinObj((winObj) => {
                let newObj = { ...winObj };
                newObj.page = <CalendarPage winObj={newObj} />;
                newObj.changeSelection = changeSelection;
                openWindow(newObj, true);
                return newObj;
            });
        });
        // listRows(db, setCalendarList);
    }, []);

    return (
        <div style={style.container}>
            <div style={style.headerBar}>
                <div style={style.header}>Scheduler</div>
                <Tooltip value="Calendar" position="right">
                    <div style={style.button} onClick={toggleCalendar}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                    </div>
                </Tooltip>
            </div>
            <div style={style.date}>
                {curDate.toDateString ? curDate.toDateString() : ""}
            </div>
            <div style={style.controls}>
                <div
                    style={style.controlItem}
                    onClick={() => {
                        setEditEvent(null);
                        setShowModal(true);
                    }}
                >
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
            <div style={style.calendarItems}>
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id}>
                            <CalendarItem
                                event={event}
                                handleDelete={handleDelete}
                                handleEdit={(event) => {
                                    setEditEvent(event);
                                    setShowModal(true);
                                }}
                            />
                            <div className="divider" />
                        </div>
                    ))
                ) : (
                    <div style={style.comment}>No events today!</div>
                )}
            </div>
            {showModal && (
                <ModalNewEvent
                    onExit={() => {
                        setShowModal((prev) => !prev);
                        setEditEvent(null);
                    }}
                    selectedDate={curDate}
                    saveEvent={(event, editMode, callback) => {
                        if (editMode) {
                            CalendarDB.editEvent(event, (err) => {
                                handleRefresh();
                                if (callback) callback(err);
                            });
                        } else {
                            CalendarDB.saveEvent(event, (err) => {
                                handleRefresh();
                                if (callback) callback(err);
                            });
                        }
                    }}
                    event={editEvent}
                />
            )}
        </div>
    );
};

export default CalendarNav;
