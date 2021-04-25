import { useState } from "react";

const switchBoxStyle = {
    width: "2.8rem",
    height: "1.4rem",
    borderRadius: "2rem",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
};

const style = {
    container: {
        display: "flex",
        padding: "0.2rem",
        justifyContent: "space-between",
    },
    switchBoxActive: {
        ...switchBoxStyle,
        backgroundColor: "var(--green)",
        justifyContent: "flex-end",
    },
    switchBoxInactive: {
        ...switchBoxStyle,
        backgroundColor: "var(--red)",
        justifyContent: "flex-start",
    },
    switch: {
        backgroundColor: "var(--dividerColor)",
        borderRadius: "2rem",
        width: "1.2rem",
        height: "1.2rem",
        margin: "0 0.15rem",
    },
    label: {
        fontSize: "1.2rem",
    },
};

/**
 * props:
 *   - label
 *   - onToggle
 *   - initialActive
 */

const Switch = (props) => {
    let [active, setActive] = useState(props.initialActive || false);

    const handleToggle = () => {
        if (props.onToggle) props.onToggle(!active, setActive);
        setActive(!active);
    };

    return (
        <div style={style.container}>
            <div>{props.label}</div>
            <div
                onClick={handleToggle}
                style={active ? style.switchBoxActive : style.switchBoxInactive}
            >
                <div style={style.switch}></div>
            </div>
        </div>
    );
};

export default Switch;
