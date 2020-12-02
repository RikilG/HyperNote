import React, { useState, useContext } from 'react';
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
    let [active, setActive] = useState(false);
    const { closeWindow } = useContext(WindowContext);

    const handleConfirm = (filename) => {
        // TODO: modify props.fileObj.name after renaming
        if (active && filename !== props.fileObj.name) {
            const oldpath = props.fileObj.path;
            const newpath = FileSystem.join(FileSystem.dirname(oldpath), filename);
            FileSystem.rename(oldpath, newpath);
        }
        setActive(false);
    }

    const handleCancel = (filename, type) => {
        setActive(false);
        if (type === 'click') {
            handleConfirm(filename);
            return;
        }
        return props.fileObj.name; // return the original file name to be reset
    }

    const handleClose = () => {
        closeWindow(props.fileObj);
    }

    const handleChange = (name) => {
        setActive(true);
    }

    return (
        <div style={styles.bar}>
            <div style={styles.defaultMouse}>
                <FontAwesomeIcon style={styles.icon} icon={faEdit} />
                <Textbox
                    initialValue={props.fileObj.name}
                    style={styles.textbox}
                    handleChange={handleChange}
                    handleConfirm={handleConfirm}
                    handleCancel={handleCancel}
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