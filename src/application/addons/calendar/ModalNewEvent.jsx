import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Textbox from "../../ui/Textbox";
import DatePicker from "../../ui/DatePicker";
import TimePicker from "../../ui/TimePicker";

const style = {
    container: {
        height: "100%",
        display: "flex",
        flexFlow: "column nowrap",
    },
    header: {
        fontSize: "1.5rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
        userSelect: "none",
    },
    textboxContainer: {
        margin: "1px 5px",
        display: "flex",
        flexFlow: "row nowrap",
    },
    rowFlex: {
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "center",
    },
    shadowText: {
        color: "var(--dividerColor)",
        textAlign: "center",
    },
    button: {
        minWidth: "80px",
    },
    eventBox: {
        background: "var(--backgroundColor)",
        padding: "0.5rem 0.8rem",
        margin: "0.2rem 0.5rem",
        fontSize: "1.2rem",
    },
    separationBox: {
        maxWidth: "35px",
        textAlign: "center",
    },
};

const recurName = ["", "daily", "weekly", "monthly", "yearly"];

const getTimeStruct = (timeStr) => {
    const [time, fmt] = timeStr.split(" ");
    const [hrs, mins] = time.split(":");
    return { hrs: parseInt(hrs), mins: parseInt(mins), fmt: fmt };
};

const invalidTime = (st, et) => {
    if (et.hrs > st.hrs) return true;
    if (et.hrs === st.hrs && et.mins > st.mins) return true;
    return false;
};

const ModalNewEvent = ({ onExit, selectedDate, saveEvent, event }) => {
    let [eventName, setEventName] = useState("");
    let [startDate, setStartDate] = useState(selectedDate);
    let [endDate, setEndDate] = useState(selectedDate);
    let [infinite, setInfinite] = useState(true);
    let [recurrence, setRecurrence] = useState("norepeat");
    let [allDay, setAllDay] = useState(false);
    let [startTime, setStartTime] = useState({ hrs: 0, mins: 0, fmt: "hrs" });
    let [endTime, setEndTime] = useState({ hrs: 0, mins: 0, fmt: "hrs" });
    let [separation, setSeparation] = useState(0);
    let [advanced, setAdvanced] = useState(false);
    let [nextOcc, setNextOcc] = useState("To be calculated");
    const selectRef = useRef(null);

    const onSave = () => {
        if (eventName === "")
            return toast.error("You forgot to enter the event name!");

        if (advanced) {
            if (
                !infinite &&
                (endDate < startDate ||
                    (endDate === startDate && invalidTime(startTime, endTime)))
            )
                return toast.error("Event cannot end before it starts!");
        } else {
            if (!event) setEndDate(startDate);
        }

        saveEvent(
            {
                id: event ? event.id : null,
                eventName: eventName,
                description: "desc",
                startDate: startDate,
                endDate: infinite && recurrence !== "norepeat" ? null : endDate,
                recurrence: recurrence,
                allDay: allDay,
                startTime: `${startTime.hrs}:${startTime.mins} ${startTime.fmt}`,
                endTime: `${endTime.hrs}:${endTime.mins} ${endTime.fmt}`,
                separation: separation,
            },
            event ? true : false,
            (err) => {
                if (!err) {
                    event
                        ? toast.success("Event created!")
                        : toast.success("Event modified!");
                    onExit();
                }
            }
        );
    };

    useEffect(() => {
        let next = new Date(startDate);
        let sep = parseInt(separation);

        if (recurrence === "yearly")
            next.setFullYear(next.getFullYear() + 1 + sep);
        else if (recurrence === "monthly")
            next.setMonth(next.getMonth() + 1 + sep);
        else if (recurrence === "weekly")
            next.setDate(next.getDate() + (sep + 1) * 7);
        else if (recurrence === "daily") next.setDate(next.getDate() + 1 + sep);

        setNextOcc(next.toDateString());
    }, [startDate, endDate, recurrence, separation]);

    useEffect(() => {
        if (event) {
            setEventName(event.title);
            setStartDate(new Date(event.start_date));
            setEndDate(new Date(event.end_date));
            setInfinite(event.end_date ? false : true);
            setRecurrence(() => {
                const val = event.is_recurring
                    ? recurName[event.recurring_type_id]
                    : "norepeat";
                selectRef.current.value = val;
                return val;
            });
            setAllDay(event.is_all_day);
            setStartTime(getTimeStruct(event.start_time));
            setEndTime(getTimeStruct(event.end_time));
            setSeparation(event.is_recurring ? event.separation_count : 0);
            setAdvanced(true);
        } else {
            const now = new Date();
            const initTime = {
                hrs: now.getHours(),
                mins: now.getMinutes(),
                fmt: "hrs",
            };
            setStartTime(initTime);
            setEndTime(initTime);
        }
    }, [event]);

    return (
        <Modal onExit={onExit}>
            <div style={style.container}>
                <div style={style.header}>{event ? "Edit" : "New"} Event</div>
                <Textbox
                    initialValue={eventName}
                    style={style.eventBox}
                    containerStyle={style.textboxContainer}
                    placeholder="Add event for ..."
                    handleChange={(name) => setEventName(name)}
                />
                <div className="new-event-grid">
                    {/* <div>Type</div>
                <div>Event</div> */}

                    <div>{advanced && "Start"} Date</div>
                    <div>
                        <DatePicker value={startDate} onChange={setStartDate} />
                    </div>

                    {advanced && <div>End Date</div>}
                    {advanced && (
                        <div style={{ display: "flex", flexFlow: "row" }}>
                            <input
                                type="checkbox"
                                checked={!infinite}
                                onChange={(e) => setInfinite(!e.target.checked)}
                            />
                            <DatePicker
                                value={endDate}
                                onChange={setEndDate}
                                tileDisabled={({ date, view }) => {
                                    if (view === "month") {
                                        return date < startDate;
                                    }
                                }}
                                disabled={infinite}
                            />
                        </div>
                    )}

                    <div>Recurrence</div>
                    <div>
                        <select
                            ref={selectRef}
                            onChange={(e) => setRecurrence(e.target.value)}
                        >
                            <option value="norepeat">Does Not Repeat</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div>All Day</div>
                    <div>
                        <input
                            type="checkbox"
                            checked={allDay}
                            onChange={(e) => setAllDay(e.target.checked)}
                        />
                        {allDay ? " (Selected)" : " (Not Selected)"}
                    </div>

                    {!allDay && <div>{advanced && "Start"} Time</div>}
                    {!allDay && <TimePicker setTime={setStartTime} />}

                    {advanced && !allDay && <div>End Time</div>}
                    {advanced && !allDay && <TimePicker setTime={setEndTime} />}

                    {/* {advanced && <div>Max occurences</div>}
                {advanced && <div>None</div>} */}

                    {advanced && recurrence !== "norepeat" && (
                        <div>Separation</div>
                    )}
                    {advanced && recurrence !== "norepeat" && (
                        <div>
                            <div style={style.rowFlex}>
                                Leave
                                <Textbox
                                    style={style.separationBox}
                                    placeholder="0"
                                    initialValue={separation}
                                    handleChange={(val) => setSeparation(val)}
                                />
                                {recurrence === "norepeat"
                                    ? ""
                                    : recurrence === "daily"
                                    ? "day(s)"
                                    : recurrence === "weekly"
                                    ? "week(s)"
                                    : recurrence === "monthly"
                                    ? "month(s)"
                                    : recurrence === "yearly"
                                    ? "year(s)"
                                    : ""}
                            </div>{" "}
                            in between occurences
                        </div>
                    )}
                </div>
                <div style={{ flex: "1" }} />

                <div>
                    <div style={style.rowFlex}>
                        <input
                            type="checkbox"
                            checked={advanced}
                            onChange={(e) => setAdvanced(e.target.checked)}
                        />
                        Advanced Options
                    </div>
                    {recurrence !== "norepeat" && (
                        <div style={style.shadowText}>
                            Next occurence on - {nextOcc} -
                        </div>
                    )}
                    <div style={style.rowFlex}>
                        <Button style={style.button} onClick={onExit}>
                            Cancel
                        </Button>
                        <Button style={style.button} onClick={onSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalNewEvent;
