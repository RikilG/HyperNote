import React, { useRef, useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSave, faWindowClose, faEdit, faColumns } from '@fortawesome/free-solid-svg-icons';

import Textbox from '../ui/Textbox';
import WindowContext from '../WindowContext';
import FileSystem from '../explorer/FileSystem';

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
    defaultMouse: {
        display: "flex",
        flex: "1",
    },
    textbox: {
        background: "var(--backgroundColor)",
        flex: "1",
    },
};

const EditorGroupBar = (props) => {
    let [filename, setFilename] = useState(props.fileObj.name);
    let [active, setActive] = useState(false);
    const { closeWindow } = useContext(WindowContext);
    const textboxRef = useRef(null);

    const handleFileRename = () => {
        if (active && filename !== props.fileObj.name) {
            const oldpath = props.fileObj.path;
            const newpath = FileSystem.join(FileSystem.dirname(oldpath), filename);
            FileSystem.rename(oldpath, newpath);
        }
        setActive(false);
    }

    const handleClick = (event) => {
        if (textboxRef.current.contains(event.target)) {
            setActive(true);
            return; // click inside textbox, do nothing
        }
        handleFileRename();
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleFileRename();
        }
        else if (event.key === 'Escape') {
            setActive(false);
            setFilename(props.fileObj.name);
        }
    }

    const handleClose = () => {
        closeWindow(props.fileObj);
    }

    const onChange = (event) => {
        setFilename(event.target.value);
        setActive(true);
    }

    return (
        <div style={styles.bar}>
            <div ref={textboxRef} style={styles.defaultMouse}>
                <FontAwesomeIcon style={styles.icon} icon={faEdit} />
                <Textbox
                    value={filename}
                    style={styles.textbox}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div style={styles.button} onClick={props.handleEditorGroup}>
                <FontAwesomeIcon style={styles.icon} icon={props.choice === 0 ? faEye : props.choice === 1 ? faColumns : faEyeSlash} />
            </div>
            <div style={styles.button} onClick={props.handleSave}>
                <FontAwesomeIcon style={styles.icon} icon={faSave} />
            </div>
            <div style={styles.button} onClick={handleClose}>
                <FontAwesomeIcon style={styles.icon} icon={faWindowClose} />
            </div>
        </div>
    );
}

export default EditorGroupBar;