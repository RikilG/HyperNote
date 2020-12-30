import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronCircleLeft,
    faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";

import WindowBar from "../../workspace/WindowBar";
import Tooltip from "../../ui/Tooltip";

const style = {
    container: {
        background: "var(--backgroundColor)",
        height: "100%",
        padding: "0 0.5rem",
        display: "flex",
        flexFlow: "column nowrap",
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
    calendarButton: {
        padding: "0.3rem",
        cursor: "pointer",
        flex: "1",
        fontStyle: "italic",
        textAlign: "center",
        userSelect: "none",
    },
    eventItem: {
        background: "var(--primaryColor)",
        borderRadius: "0.3rem",
        fontSize: "0.9rem",
        margin: "0.2rem",
        padding: "0.05rem 0.2rem",
        height: "1rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        boxShadow: "4px 2px 4px rgba(0, 0, 0, 0.4)",
    },
    eventMore: {
        fontSize: "0.8rem",
        paddingLeft: "0.5rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
};

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const monthToDays = (month, year) => {
    if (month === 1) {
        if (year % 4 === 0) {
            if (year % 100 === 0 && year % 400 !== 0) return 28;
            return 29;
        } else return 28;
    } else if ([3, 5, 8, 10].includes(month)) return 30;
    else return 31;
};

const CalendarGrid = ({
    month,
    year,
    getMonthEvents,
    getCalendarDates,
    setCurDate,
}) => {
    let [monthEvents, setMonthEvents] = useState({});

    const setDate = (dateItem) => {
        if (dateItem.date !== 0)
            setCurDate(
                (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth(), dateItem.date)
            );
    };

    useEffect(() => {
        getMonthEvents(new Date(year, month, 1), (events) => {
            setMonthEvents(events);
        });
    }, [getMonthEvents, month, year]);

    return (
        <div className="calendar-grid">
            {WEEKDAYS.map((day, ind) => (
                <div key={ind} className="weekday">
                    {day}
                </div>
            ))}
            {getCalendarDates().map((dateItem, ind) => (
                <div
                    key={ind}
                    className={
                        dateItem.date === 0
                            ? "empty"
                            : dateItem.isToday
                            ? "today"
                            : dateItem.isSelected
                            ? "active-selection"
                            : ""
                    }
                    onClick={() => setDate(dateItem)}
                >
                    <div style={{ margin: "0.3rem", marginBottom: "0" }}>
                        {dateItem.date === 0 ? "" : dateItem.date}
                    </div>
                    <div style={{ overflowY: "auto" }}>
                        {monthEvents[dateItem.date] &&
                            (monthEvents[dateItem.date].length <= 2 ? (
                                monthEvents[dateItem.date].map((event) => (
                                    <div
                                        style={style.eventItem}
                                        key={`${event.id}-${dateItem.date}`}
                                    >
                                        {event.title}
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <div style={style.eventItem}>
                                        {monthEvents[dateItem.date][0].title}
                                    </div>
                                    <div style={style.eventItem}>
                                        {monthEvents[dateItem.date][1].title}
                                    </div>
                                    <div style={style.eventMore}>
                                        {monthEvents[dateItem.date].length - 2}{" "}
                                        more...
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const MonthGrid = ({ curDate, setCurDate, setSelectMonth, setSelectYear }) => {
    return (
        <div className="month-grid">
            {MONTHS.map((month, ind) => (
                <div
                    key={month}
                    onClick={() => {
                        setCurDate(
                            (prev) =>
                                new Date(
                                    prev.getFullYear(),
                                    ind,
                                    prev.getDate()
                                )
                        );
                        setSelectMonth(false);
                        setSelectYear(false);
                    }}
                    className={
                        ind === curDate.getMonth() ? "active-selection" : ""
                    }
                >
                    {month}
                </div>
            ))}
        </div>
    );
};

const YearGrid = ({ getYears, setCurDate, setSelectMonth, setSelectYear }) => {
    return (
        <div className="year-grid">
            {getYears().map((yearItem, ind) => (
                <div
                    key={ind}
                    onClick={() => {
                        setCurDate(
                            (prev) =>
                                new Date(
                                    yearItem.year,
                                    prev.getMonth(),
                                    prev.getDate()
                                )
                        );
                        setSelectYear(false);
                        setSelectMonth(true);
                    }}
                    className={yearItem.isSelected ? "active-selection" : ""}
                >
                    {yearItem.year}
                </div>
            ))}
        </div>
    );
};

const CalendarPage = (props) => {
    const { changeSelection, getMonthEvents } = props.winObj;
    const today = new Date();
    let [curDate, setCurDate] = useState(today);
    let [selectMonth, setSelectMonth] = useState(false);
    let [selectYear, setSelectYear] = useState(false);

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
                isSelected: i === curDate.getDate(),
            });
        }
        for (let j = 0; j < (42 - initialDate.getDay() + 1 - i) % 7; j++)
            dates.push({ date: 0 });
        return dates;
    };

    const getYears = () => {
        let yearList = [];
        let currentYear = curDate.getFullYear();
        let startYear = currentYear - 17;
        for (let i = startYear; i < startYear + 35; i++) {
            yearList.push({
                year: i,
                isToday: i === new Date().getFullYear(),
                isSelected: i === curDate.getFullYear(),
            });
        }
        return yearList;
    };

    const getPrevSection = () => {
        setCurDate(
            (prev) =>
                new Date(
                    selectYear ? prev.getFullYear() - 17 : prev.getFullYear(),
                    prev.getMonth() - 1,
                    prev.getDate()
                )
        );
    };

    const getNextSection = () => {
        setCurDate(
            (prev) =>
                new Date(
                    selectYear ? prev.getFullYear() + 17 : prev.getFullYear(),
                    prev.getMonth() + 1,
                    prev.getDate()
                )
        );
    };

    useEffect(() => {
        changeSelection(curDate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        changeSelection(curDate);
    }, [curDate, changeSelection]);

    return (
        <div style={style.container}>
            <WindowBar winObj={props.winObj} title="Calendar" />
            <div style={style.calendar}>
                <div className="calendar-bar">
                    <div onClick={getPrevSection} style={style.calendarIcon}>
                        <Tooltip value="Previous month" position="right">
                            <FontAwesomeIcon icon={faChevronCircleLeft} />
                        </Tooltip>
                    </div>
                    <div
                        style={style.calendarButton}
                        onClick={() => {
                            setSelectMonth((prev) => !prev);
                            setSelectYear(false);
                        }}
                    >
                        <Tooltip value="Change month" position="below">
                            {MONTHS[curDate.getMonth()]}
                        </Tooltip>
                    </div>
                    <div
                        style={style.calendarButton}
                        onClick={() => {
                            setSelectYear((prev) => !prev);
                            setSelectMonth(false);
                        }}
                    >
                        <Tooltip value="Change year" position="below">
                            {curDate.getFullYear()}
                        </Tooltip>
                    </div>
                    <div onClick={getNextSection} style={style.calendarIcon}>
                        <Tooltip value="Next month" position="left">
                            <FontAwesomeIcon icon={faChevronCircleRight} />
                        </Tooltip>
                    </div>
                </div>
                {selectMonth && (
                    <MonthGrid
                        curDate={curDate}
                        setCurDate={setCurDate}
                        setSelectMonth={setSelectMonth}
                        setSelectYear={setSelectYear}
                    />
                )}
                {selectYear && (
                    <YearGrid
                        getYears={getYears}
                        setCurDate={setCurDate}
                        setSelectMonth={setSelectMonth}
                        setSelectYear={setSelectYear}
                    />
                )}
                {!selectMonth && !selectYear && (
                    <CalendarGrid
                        month={curDate.getMonth()}
                        year={curDate.getFullYear()}
                        getMonthEvents={getMonthEvents}
                        getCalendarDates={getCalendarDates}
                        setCurDate={setCurDate}
                    />
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
