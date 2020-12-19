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
import CalendarEvent from "./CalendarEvent";
import WindowContext from "../../WindowContext";

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
};

const CalendarNav = () => {
    let [curDate, setCurDate] = useState(Date());
    let [showModal, setShowModal] = useState(false);
    const { openWindow } = useContext(WindowContext);
    let [winObj, setWinObj] = useState({
        addon: "calendar",
        id: "calendar/default-0",
        page: undefined,
        changeSelection: () => {},
    });

    const handleRefresh = () => {
        // listRows(db, setCalendarList);
    };

    const toggleCalendar = () => {
        openWindow(winObj, true);
    };

    const changeSelection = (curDate) => {
        // called via CalendarPage when user selects a date
        setCurDate(curDate);
    };

    useEffect(() => {
        setWinObj((winObj) => {
            let newObj = { ...winObj };
            newObj.page = <CalendarPage winObj={newObj} />;
            newObj.changeSelection = changeSelection;
            openWindow(newObj, true);
            return newObj;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // TODO: show calendar button

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
                    onClick={() => setShowModal(true)}
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
            <div style={style.calendarItems}></div>
            {showModal && (
                <CalendarEvent
                    onExit={() => setShowModal((prev) => !prev)}
                    selectedDate={curDate}
                />
            )}
        </div>
    );
};

export default CalendarNav;
