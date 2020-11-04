import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSave, faWindowClose, faFile, faColumns } from '@fortawesome/free-solid-svg-icons';

let styles = {
    bar: {
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "space-evenly",
        padding: "5px",
    },
    icon: {
        margin: "0 5px",
    },
    button: {
        cursor: "pointer",
    },
    defaultMouse: {
        cursor: "default",
    },
};

export default class EditorGroupBar extends React.Component {
    render() {
        return (
            <div style={styles.bar}>
                <div style={styles.defaultMouse}>
                    <FontAwesomeIcon style={styles.icon} icon={faFile} />
                    <span>{this.props.filename}</span>
                </div>
                <div style={styles.button} onClick={this.props.handleEditorGroup}>
                    <FontAwesomeIcon style={styles.icon} icon={this.props.choice === 0 ? faEye : this.props.choice === 1 ? faColumns : faEyeSlash} />
                    <span>{this.props.choice === 0 ? "Show Render" : this.props.choice === 1 ? "Show Both" : "Hide Render"}</span>
                </div>
                <div style={styles.button}>
                    <FontAwesomeIcon style={styles.icon} icon={faSave} />
                    <span>Save</span>
                </div>
                <div style={styles.button} onClick={this.props.handleClose}>
                    <FontAwesomeIcon style={styles.icon} icon={faWindowClose} />
                    <span>Close</span>
                </div>
            </div>
        );
    }
}