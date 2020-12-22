import { useState } from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Textbox from "../../ui/Textbox";

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
    timeBox: {
        background: "var(--backgroundColor)",
        padding: "0.2rem",
        margin: "0 0.2rem",
        width: "30px",
        textAlign: "center",
    },
    footer: {
        position: "absolute",
        width: "100%",
        bottom: "0",
    },
};

const CalendarEvent = ({ onExit, selectedDate }) => {
    const now = new Date();
    let [advanced, setAdvanced] = useState(false);
    let [allDay, setAllDay] = useState(false);
    let [recurrence, setRecurrence] = useState("norepeat");

    return (
        <Modal onExit={onExit}>
            <div style={style.header}>New Event</div>
            <Textbox style={style.eventBox} placeholder="Add event for ..." />
            <div className="new-event-grid">
                {/* <div>Type</div>
                <div>Event</div> */}
                <div>Date</div>
                <div>{selectedDate.toDateString()}</div>

                <div>Recurrent</div>
                <div>
                    <select onChange={(e) => setRecurrence(e.target.value)}>
                        <option value="norepeat">Does Not Repeat</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                {advanced && <div>End Date</div>}
                {advanced && <div>Today</div>}

                <div>All Day</div>
                <div>
                    <input
                        type="checkbox"
                        onClick={(e) => setAllDay(e.target.checked)}
                    />
                    {allDay ? " (Selected)" : " (Not Selected)"}
                </div>

                {!allDay && <div>Time</div>}
                {!allDay && (
                    <div style={style.rowFlex}>
                        <Textbox
                            style={style.timeBox}
                            placeholder="HH"
                            initialValue={now.getHours()}
                        />
                        <div>:</div>
                        <Textbox
                            style={style.timeBox}
                            placeholder="MM"
                            initialValue={now.getMinutes()}
                        />
                        <select>
                            <option>24-Hour</option>
                            <option>AM</option>
                            <option>PM</option>
                        </select>
                    </div>
                )}

                {advanced && !allDay && <div>End Time</div>}
                {advanced && !allDay && (
                    <div style={style.rowFlex}>
                        <Textbox
                            style={style.timeBox}
                            placeholder="HH"
                            initialValue={now.getHours()}
                        />
                        <div>:</div>
                        <Textbox
                            style={style.timeBox}
                            placeholder="MM"
                            initialValue={now.getMinutes()}
                        />
                        <select>
                            <option>24-Hour</option>
                            <option>AM</option>
                            <option>PM</option>
                        </select>
                    </div>
                )}

                {/* {advanced && <div>Max occurences</div>}
                {advanced && <div>None</div>} */}

                {advanced && <div>Separation</div>}
                {advanced && recurrence !== "norepeat" && (
                    <div>
                        <div style={style.rowFlex}>
                            Leave
                            <Textbox
                                style={style.timeBox}
                                placeholder="0"
                                initialValue="0"
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
                    <Button style={style.button}>Cancel</Button>
                    <Button style={style.button}>Save</Button>
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
