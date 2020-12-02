import { useEffect, useState } from 'react';

import UserPreferences from '../../settings/UserPreferences';
import WindowBar from '../../workspace/WindowBar';
import Progressbar from '../../ui/Progressbar';
import { openDatabase } from '../../Database';
import Textarea from '../../ui/Textarea';
import { editRow } from './PomodoroDB';
import Tooltip from '../../ui/Tooltip';

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
    },
    timers: {
        margin: "0.6rem",
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-evenly",
    },
    timer: {
        background: "var(--primaryColor)",
        color: "var(--secondaryTextColor)",
        paddingTop: "0.5rem",
        borderRadius: "0.4rem",
        fontSize: "1.5rem",
        textAlign: "center",
        width: "35%",
    },
}

const PomodoroPage = (props) => {
    const pomoDuration = 2; // 20 min
    let [running, setRunning] = useState(false);
    let [time, setTime] = useState(pomoDuration*60);
    let [minutesLeft, setMinutesLeft] = useState(pomoDuration);
    const taskItem = props.winObj.taskItem;
    const db = openDatabase(UserPreferences.get('pomoStorage'));

    useEffect(() => {
        const timer = setInterval(() => {
            running && setTime(time => time-1);
        }, 1000);
        return () => clearInterval(timer);
    }, [running])

    useEffect(() => {
        if (time <= 0) setTime(pomoDuration*60);
        setMinutesLeft(Math.floor(time/60));
    }, [time])

    const handleReset = () => {
        setRunning(false);
        setTime(pomoDuration*60);
        setMinutesLeft(pomoDuration);
        props.winObj.running = false;
    }

    const handlePlayPause = () => {
        setRunning(!running);
        props.winObj.running = true;
    }

    const handleDescChange = (desc) => {
        taskItem.desc = desc;
        editRow(db, taskItem)
    }

    return (
        <div style={style.container}>
            <WindowBar winObj={props.winObj} title={"Pomodoro"} />
            <div style={style.title}>{taskItem.name}</div>
            <Textarea
                initialValue={taskItem.desc}
                style={style.description}
                handleCancel={handleDescChange}
                placeholder={"<Enter description here>"}
            />
            <div style={style.timers}>
                <div style={style.timer}>
                    <div>Time Left</div>
                    <div style={style.title}>
                        00:
                        {String(minutesLeft).padStart(2, '0')}:
                        {String(time % 60).padStart(2, '0')}
                    </div>
                </div>
                <div style={style.timer}>
                    <div>Time Elapsed</div>
                    <div style={style.title}>
                        00:
                        {String(Math.max(pomoDuration - minutesLeft - 1, 0)).padStart(2, '0')}:
                        {String(60 - (time % 60)).padStart(2, '0')}
                    </div>
                </div>
            </div>
            <Progressbar completed={pomoDuration*60 - time} total={pomoDuration*60} />
            <div style={style.timers}>
                <Tooltip value="Play/Pause">
                    <div onClick={handlePlayPause} className="button">Play/Pause</div>
                </Tooltip>
                <Tooltip value="Reset">
                    <div onClick={handleReset} className="button">Reset</div>
                </Tooltip>
            </div>
        </div>
    );
}

export default PomodoroPage;