import { useEffect, useState } from 'react';

import WindowBar from '../../workspace/WindowBar';
import Progressbar from '../../ui/Progressbar';
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
        height: "25%",
        maxHeight: "25%",
        fontSize: "1.1rem",
        textAlign: "center",
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

    return (
        <div style={style.container}>
            <WindowBar winObj={props.winObj} title={"Pomodoro"} />
            <div style={style.title}>{props.winObj.name}</div>
            <div style={style.description}>Some description</div>
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