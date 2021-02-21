import { useCallback, useEffect, useState } from "react";

import UserPreferences from "../../settings/UserPreferences";
import WindowBar from "../../workspace/WindowBar";
import Progressbar from "../../ui/Progressbar";
import CheckBox from "../../ui/CheckBox";
import { useAudio } from "../../ui/AudioPlayer";
import { openDatabase } from "../../Database";
import Textarea from "../../ui/Textarea";
import { editRow } from "./PomodoroDB";
import Tooltip from "../../ui/Tooltip";

const style = {
    container: {
        // background: "#FF4030",
        background: "var(--backgroundColor)",
        height: "100%",
        padding: "0 0.5rem",
    },
    title: {
        margin: "0.8rem",
        fontSize: "2rem",
        fontWeight: "bold",
        textAlign: "center",
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
        color: "var(--primaryTextColor)",
        outline: "none",
    },
    timers: {
        margin: "0.6rem",
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
    },
    timer: {
        background: "var(--primaryColor)",
        paddingTop: "0.5rem",
        borderRadius: "0.4rem",
        fontSize: "1.5rem",
        textAlign: "center",
        width: "35%",
    },
    timeBox: {
        background: "var(--backgroundAccent)",
        padding: "0.2rem",
        margin: "0 0.2rem",
        width: "3rem",
        textAlign: "center",
        color: "var(--primaryTextColor)",
        // border: "none",
        borderRadius: "0.3rem",
    },
    options: {
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
    },
};

const PomodoroPage = (props) => {
    const taskItem = props.winObj.taskItem;
    const db = openDatabase(UserPreferences.get("pomoStorage"));

    let [duration, setDuration] = useState(taskItem.duration);
    let [customInput, setCustomInput] = useState(
        duration !== 25 && duration !== 50
    );
    let [running, setRunning] = useState(false);
    let [time, setTime] = useState(duration * 60);
    let [minutesLeft, setMinutesLeft] = useState(duration);
    let [hoursLeft, setHoursLeft] = useState(Math.floor(duration / 60));
    let [tickingCheckBox, setTickingCheckBox] = useState(taskItem.tickingSound);
    let [ringingCheckBox, setRingingCheckBox] = useState(taskItem.ringingSound);
    let [, tickingToggle, setTicking] = useAudio(
        // "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        "hypernote://media/audio/pomodoro/fast-ticking.wav",
        true
    );
    let [ringing, ringingToggle, setRinging] = useAudio(
        "hypernote://media/audio/pomodoro/clock-ringing.wav"
    );

    const handleReset = useCallback(() => {
        setRunning(false);
        setTime(duration * 60);
        setMinutesLeft(duration);
        setHoursLeft(Math.floor(duration / 60));
        props.winObj.running = false;
        setTicking(false);
        setRinging(false);
    }, [duration, props.winObj, setTicking, setRinging]);

    useEffect(() => {
        // to run on task change only
        const newDuration = taskItem.duration;
        setDuration(newDuration);
        setTime(newDuration * 60);
        setMinutesLeft(newDuration);
        setHoursLeft(Math.floor(newDuration / 60));
        setTickingCheckBox(taskItem.tickingSound);
        setRingingCheckBox(taskItem.ringingSound);
        setCustomInput(newDuration !== 25 && newDuration !== 50);
    }, [taskItem, props.winObj.taskItem]);

    useEffect(() => {
        const timer = setInterval(() => {
            running && setTime((time) => time - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [running]);

    useEffect(() => {
        if (time <= 0) {
            // DONE, Finished, time up!!
            if (!ringing && ringingCheckBox) ringingToggle();
            setRunning(false);
            setTicking(false);
        }
        setMinutesLeft(Math.floor(time / 60));
        setHoursLeft(Math.floor(time / 3600));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time]);

    useEffect(() => {
        handleReset();
    }, [duration, handleReset]);

    const handlePlayPause = () => {
        setRunning(!running);
        props.winObj.running = true;
        if (tickingCheckBox) {
            tickingToggle();
        }
    };

    const handleTaskEdit = (key, value) => {
        taskItem[key] = value;
        editRow(db, taskItem);
    };

    return (
        <div style={style.container}>
            <WindowBar
                winObj={props.winObj}
                title={"Pomodoro"}
                onExit={handleReset}
            />
            <div style={style.title}>{taskItem.name}</div>
            <Textarea
                initialValue={taskItem.desc}
                style={style.description}
                handleCancel={(desc) => handleTaskEdit("desc", desc)}
                placeholder={"<Enter description here>"}
            />
            <div style={style.timers}>
                <div style={style.timer}>
                    <div>Time Left</div>
                    <div style={style.title}>
                        {String(hoursLeft).padStart(2, "0")}:
                        {String(minutesLeft % 60).padStart(2, "0")}:
                        {String(time % 60).padStart(2, "0")}
                    </div>
                </div>
                <div style={style.timer}>
                    <div>Time Elapsed</div>
                    <div style={style.title}>
                        {String(
                            Math.max(
                                Math.floor(duration / 60) - hoursLeft - 1,
                                0
                            )
                        ).padStart(2, "0")}
                        :
                        {String(
                            Math.max(duration - minutesLeft - 1, 0)
                        ).padStart(2, "0")}
                        :{String((60 - (time % 60)) % 60).padStart(2, "0")}
                    </div>
                </div>
            </div>
            <Progressbar
                completed={duration * 60 - time}
                total={duration * 60}
            />
            <div style={style.timers}>
                <Tooltip value="Play/Pause">
                    <div onClick={handlePlayPause} className="button">
                        Play / Pause
                    </div>
                </Tooltip>
                <Tooltip value="Reset">
                    <div onClick={handleReset} className="button">
                        Reset / Stop
                    </div>
                </Tooltip>
            </div>
            <div style={style.options}>
                <div>
                    <span style={{ paddingRight: "20px" }}>Duration</span>
                    <select
                        value={
                            duration === 25 || duration === 50
                                ? duration
                                : "custom"
                        }
                        onChange={(e) => {
                            if (e.target.value === "custom") {
                                setCustomInput(true);
                                setDuration(25);
                                handleTaskEdit("duration", 25);
                            } else {
                                setCustomInput(false);
                                setDuration(parseInt(e.target.value));
                                handleTaskEdit("duration", e.target.value);
                            }
                        }}
                    >
                        <option value="25">Short - 25+5 min</option>
                        <option value="50">Long - 50+10 min</option>
                        <option value="custom">Custom</option>
                    </select>
                    {customInput && (
                        <input
                            type="number"
                            min={0}
                            max={180}
                            style={style.timeBox}
                            placeholder="Duration"
                            value={duration}
                            onChange={(e) => {
                                setDuration(Math.min(e.target.value, 180));
                                handleTaskEdit("duration", e.target.value);
                            }}
                        />
                    )}
                </div>
                <div>
                    <CheckBox
                        initialText={"Ticking Sound"}
                        value={tickingCheckBox}
                        onChange={(e) => {
                            if (running) setTicking(e.target.checked);
                            setTickingCheckBox(e.target.checked);
                            handleTaskEdit("tickingSound", e.target.checked);
                        }}
                    />
                    <CheckBox
                        initialText={"Play sound after pomodoro completes"}
                        value={ringingCheckBox}
                        onChange={(e) => {
                            setRingingCheckBox(e.target.checked);
                            handleTaskEdit("ringingSound", e.target.checked);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PomodoroPage;
