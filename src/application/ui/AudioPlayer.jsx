import React, { useState, useEffect } from "react";

const useAudio = (url, loop = false) => {
    const [audio] = useState(() => {
        const temp = new Audio(url);
        temp.loop = loop;
        return temp;
    });
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing, audio]);

    useEffect(() => {
        audio.addEventListener("ended", () => setPlaying(false));
        return () => {
            audio.removeEventListener("ended", () => setPlaying(false));
        };
    }, [audio]);

    return [playing, toggle, setPlaying];
};

const AudioPlayer = ({ url }) => {
    const [playing, toggle] = useAudio(url);

    return (
        <div>
            <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};

export default AudioPlayer;
export { useAudio };
