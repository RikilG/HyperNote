import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronCircleLeft,
    faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

// import UserPreferences from "../../settings/UserPreferences";
import WindowBar from "../../workspace/WindowBar";
// import { openDatabase } from "../../Database";
// import Textarea from "../../ui/Textarea";
// import { editRow } from "./CalendarDB";
import Tooltip from "../../ui/Tooltip";

const style = {
    container: {
        background: "var(--backgroundColor)",
        height: "100%",
        padding: "0 0.5rem",
        display: "flex",
        flexFlow: "column nowrap",
    },
    description: {
        display: "block",
        margin: "auto",
        height: "20%",
        minHeight: "30px",
        maxHeight: "35%",
        width: "80%",
        resize: "vertical",
        fontSize: "1.1rem",
        textAlign: "center",
        background: "transparent",
    },
    calendar: {
        display: "flex",
        flexFlow: "column nowrap",
        margin: "0.1rem",
        flex: "1",
    },
    calendarIcon: {
        padding: "0.3rem",
        cursor: "pointer",
    },
};

const CalendarPage = (props) => {
    const taskItem = props.winObj.taskItem;
    // const db = openDatabase(UserPreferences.get("calendarStorage"));
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    let [curDate, setCurDate] = useState(today);

    // const handleDescChange = (desc) => {
    //     taskItem.desc = desc;
    //     editRow(db, taskItem);
    // };

    const monthToDays = (month, year) => {
        if (month === 1) {
            if (year % 4 === 0) {
                if (year % 100 === 0 && year % 400 !== 0) return 28;
                return 29;
            } else return 28;
        } else if ([3, 5, 8, 10].includes(month)) return 30;
        else return 31;
    };

    const getCalendarDates = () => {
        let dates = [];
        const month = curDate.getMonth();
        const year = curDate.getFullYear();
        const initialDate = new Date(year, month, 1);
        let i = 1;
        for (let j = 0; j < initialDate.getDay(); j++) dates.push({ date: 0 });
        for (i = 1; i <= monthToDays(month, year); i++) {
            dates.push({
                date: i,
                isToday:
                    i === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear(),
            });
        }
        for (; i <= 42 - initialDate.getDay(); i++) dates.push({ date: 0 });
        return dates;
    };

    const getPrevMonth = () => {
        setCurDate(
            (prev) =>
                new Date(
                    prev.getFullYear(),
                    prev.getMonth() - 1,
                    prev.getDate()
                )
        );
    };

    const getNextMonth = () => {
        setCurDate(
            (prev) =>
                new Date(
                    prev.getFullYear(),
                    prev.getMonth() + 1,
                    prev.getDate()
                )
        );
    };

    return (
        <div style={style.container}>
            <WindowBar winObj={props.winObj} title={taskItem.name} />
            {/* <Textarea
                initialValue={taskItem.desc}
                style={style.description}
                handleCancel={handleDescChange}
                placeholder={"<Enter description here>"}
            /> */}
            <div style={style.calendar}>
                <div className="calendar-bar">
                    <div onClick={getPrevMonth} style={style.calendarIcon}>
                        <Tooltip value="Previous month" position="right">
                            <FontAwesomeIcon icon={faChevronCircleLeft} />
                        </Tooltip>
                    </div>
                    <div style={style.calendarIcon}>Month</div>
                    <div style={style.calendarIcon}>Year</div>
                    <div onClick={getNextMonth} style={style.calendarIcon}>
                        <Tooltip value="Next month" position="left">
                            <FontAwesomeIcon icon={faChevronCircleRight} />
                        </Tooltip>
                    </div>
                </div>
                <div className="calendar-grid">
                    {weekdays.map((day, ind) => (
                        <div key={ind} className="weekday">
                            {day}
                        </div>
                    ))}
                    {getCalendarDates().map((dateItem, ind) => (
                        <div
                            key={ind}
                            className={dateItem.date === 0 ? "empty" : ""}
                        >
                            {dateItem.date === 0 ? "" : dateItem.date}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
