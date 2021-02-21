import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import Tooltip from "../ui/Tooltip";
import WindowContext from "../WindowContext";

const style = {
    bar: {
        padding: "0.2rem",
        display: "flex",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.3rem",
    },
    closeButton: {
        padding: "0.2rem",
        cursor: "pointer",
    },
    spacer: {
        flex: "1",
    },
};

const WindowBar = (props) => {
    const { closeWindow } = useContext(WindowContext);

    return (
        <div style={style.bar}>
            <div style={style.spacer}></div>
            <div style={style.title}>{props.title}</div>
            <div style={style.spacer}></div>
            <Tooltip value="close" position="left">
                <div
                    style={style.closeButton}
                    onClick={() => {
                        if (props.onExit) props.onExit();
                        // complete onExit tasks
                        setTimeout(() => closeWindow(props.winObj), 100);
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
            </Tooltip>
        </div>
    );
};

export default WindowBar;
