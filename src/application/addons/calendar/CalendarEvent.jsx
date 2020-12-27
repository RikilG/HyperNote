import { useState } from "react";
import { toast } from "react-toastify";

import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Textbox from "../../ui/Textbox";
import DatePicker from "../../ui/DatePicker";
import TimePicker from "../../ui/TimePicker";

const style = {
    header: {
        fontSize: "1.5rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
        userSelect: "none",
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
    footer: {
        position: "absolute",
        width: "100%",
        bottom: "0",
    },
};

const invalidTime = (st, et) => {
    if (et.hrs > st.hrs) return true;
    if (et.hrs === st.hrs && et.mins > st.mins) return true;
    return false;
};

const CalendarEvent = ({ onExit, selectedDate, saveEvent }) => {
    let [eventName, setEventName] = useState("");
    let [startDate, setStartDate] = useState(selectedDate);
    let [endDate, setEndDate] = useState(selectedDate);
    let [recurrence, setRecurrence] = useState("norepeat");
    let [allDay, setAllDay] = useState(false);
    let [startTime, setStartTime] = useState({ hrs: 0, mins: 0, fmt: "hrs" });
    let [endTime, setEndTime] = useState({ hrs: 0, mins: 0, fmt: "hrs" });
    let [separation, setSeparation] = useState(0);
    let [advanced, setAdvanced] = useState(false);

    const onSave = () => {
        if (eventName === "")
            return toast.error("You forgot to enter the event name!");

        if (advanced) {
            if (
                endDate < startDate ||
                (endDate === startDate && invalidTime(startTime, endTime))
            )
                return toast.error("Event cannot end before it starts!");
        } else {
            if (recurrence === "norepeat") {
                setEndDate(startDate);
            } else {
                setEndDate(null); // repeat indefinetely
            }
        }

        saveEvent(
            {
                eventName: eventName,
                description: "desc",
                startDate: startDate,
                endDate: endDate,
                recurrence: recurrence,
                allDay: allDay,
                startTime: `${startTime.hrs}:${startTime.mins} ${startTime.fmt}`,
                endTime: `${endTime.hrs}:${endTime.mins} ${endTime.fmt}`,
                separation: separation,
            },
            (err) => {
                if (!err) {
                    toast.success("Event created!");
                    onExit();
                }
            }
        );
    };

    return (
        <Modal onExit={onExit}>
            <div style={style.header}>New Event</div>
            <Textbox
                style={style.eventBox}
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
                    <div>
                        <DatePicker
                            value={endDate}
                            onChange={setEndDate}
                            tileDisabled={({ date, view }) => {
                                if (view === "month") {
                                    return date < startDate;
                                }
                            }}
                        />
                    </div>
                )}

                <div>Recurrence</div>
                <div>
                    <select onChange={(e) => setRecurrence(e.target.value)}>
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
                        onClick={(e) => setAllDay(e.target.checked)}
                    />
                    {allDay ? " (Selected)" : " (Not Selected)"}
                </div>

                {!allDay && <div>{advanced && "Start"} Time</div>}
                {!allDay && <TimePicker setTime={setStartTime} />}

                {advanced && !allDay && <div>End Time</div>}
                {advanced && !allDay && <TimePicker setTime={setEndTime} />}

                {/* {advanced && <div>Max occurences</div>}
                {advanced && <div>None</div>} */}

                {advanced && recurrence !== "norepeat" && <div>Separation</div>}
                {advanced && recurrence !== "norepeat" && (
                    <div>
                        <div style={style.rowFlex}>
                            Leave
                            <Textbox
                                style={style.timeBox}
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
                                : ""}
                        </div>{" "}
                        in between occurences
                    </div>
                )}
            </div>

            <div style={style.footer}>
                <div style={style.rowFlex}>
                    <input
                        type="checkbox"
                        onClick={(e) => setAdvanced(e.target.checked)}
                    />
                    Advanced Options
                </div>
                <div style={style.shadowText}>
                    Next occurence on - To be calculated -
                </div>
                <div style={style.rowFlex}>
                    <Button style={style.button} onClick={onExit}>
                        Cancel
                    </Button>
                    <Button style={style.button} onClick={onSave}>
                        Save
                    </Button>
                </div>
            </div>
            {/* {textbox && (
                <Textbox
                    visible={textbox}
                    setVisible={setTextbox}
                    // handleConfirm={}
                    // handleCancel={() => setTextbox(false)}
                    placeholder=" New Event "
                />
            )} */}
        </Modal>
    );
};

export default CalendarEvent;
