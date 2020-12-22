import { useEffect, useState } from "react";

const style = {
    container: {
        padding: "0.4rem 0",
        width: "100%",
    },
    empty: {
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-evenly",
        background: "var(--backgroundAccent)",
        borderRadius: "0.4rem",
        width: "100%",
    },
    full: {
        background: "var(--primaryColor)",
        margin: "0 0.3rem",
        maxWidth: "calc(100% - 1rem)",
        borderRadius: "0.4rem",
        textAlign: "center",
        position: "relative",
        boxSizing: "bounding-box",
    },
    progressText: {
        position: "absolute",
        transform: "translateY(-50%)",
        right: "0",
        left: "0",
    },
};

const Progressbar = (props) => {
    let [progress, setProgress] = useState(0);
    /* these can be passed down here
    props = {
        completed: // amount of work done
        total: // total amount of work which is mapped to 100%
        backThickness: // thickness of behind bar
        foreThickness: // thickness of foreground bar

    }
    */

    useEffect(() => {
        let temp = (props.completed / props.total) * 100 || 0;
        setProgress(Math.max(0, Math.min(temp, 100)));
    }, [props.completed, props.total]);

    return (
        <div style={style.container}>
            <div
                style={{
                    ...style.empty,
                    height: props.backThickness || "15px",
                }}
            >
                <div
                    style={{
                        ...style.full,
                        width: `${progress}%`,
                        padding: props.foreThickness || "3px",
                    }}
                >
                    <div style={style.progressText}>
                        {Math.round(progress)}%
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progressbar;
