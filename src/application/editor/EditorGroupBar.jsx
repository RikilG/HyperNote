import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faICursor,
    faSave,
    faWindowClose,
    faScroll,
    faColumns,
    faPen,
} from "@fortawesome/free-solid-svg-icons";

import Textbox from "../ui/Textbox";
import WindowContext from "../WindowContext";
import FileSystem from "../FileSystem";
import Tooltip from "../ui/Tooltip";

let styles = {
    bar: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-evenly",
        padding: "5px",
        background: "var(--backgroundAccent)",
    },
    icon: {
        margin: "2px 12px",
    },
    button: {
        cursor: "pointer",
    },
};

const EditorGroupBar = (props) => {
    let [active, setActive] = useState(false);
    const { closeWindow } = useContext(WindowContext);

    const handleConfirm = (filename) => {
        // TODO: modify props.fileObj.name after renaming
        if (active && filename !== props.fileObj.name) {
            const oldpath = props.fileObj.path;
            const newpath = FileSystem.join(
                FileSystem.dirname(oldpath),
                filename
            );
            FileSystem.rename(oldpath, newpath);
            // wait for it to write to disk
            setTimeout(props.fileObj.refresh, 400);
        }
        setActive(false);
    };

    const handleCancel = (filename, type) => {
        setActive(false);
        if (type === "click") {
            handleConfirm(filename);
            return;
        }
        return props.fileObj.name; // return the original file name to be reset
    };

    const handleClose = () => {
        closeWindow(props.fileObj);
    };

    const handleActive = () => {
        setActive((value) => !value);
    };

    return (
        <div style={styles.bar}>
            <FontAwesomeIcon style={styles.icon} icon={faScroll} />
            <Textbox
                initialValue={props.fileObj.name}
                style={{
                    background: active
                        ? "var(--backgroundColor)"
                        : "var(--backgroundAccent)",
                    flex: "1",
                    width: "20px",
                }}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
                disabled={!active}
            />
            <div style={styles.button} onClick={handleActive}>
                <Tooltip value="Rename" position="bottom">
                    <FontAwesomeIcon style={styles.icon} icon={faPen} />
                </Tooltip>
            </div>
            <div style={styles.button} onClick={props.handleEditorGroup}>
                <Tooltip
                    value={
                        props.choice === 0
                            ? "Renderer"
                            : props.choice === 1
                            ? "Editor & Renderer"
                            : "Editor"
                    }
                    position="bottom"
                >
                    <FontAwesomeIcon
                        style={styles.icon}
                        icon={
                            props.choice === 0
                                ? faEye
                                : props.choice === 1
                                ? faColumns
                                : faICursor
                        }
                    />
                </Tooltip>
            </div>
            <div style={styles.button} onClick={props.handleSave}>
                <Tooltip value="Save" position="bottom">
                    <FontAwesomeIcon style={styles.icon} icon={faSave} />
                </Tooltip>
            </div>
            <div style={styles.button} onClick={handleClose}>
                <Tooltip value="Close" position="bottom">
                    <FontAwesomeIcon style={styles.icon} icon={faWindowClose} />
                </Tooltip>
            </div>
        </div>
    );
};

export default EditorGroupBar;
