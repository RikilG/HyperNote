import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSave, faWindowClose, faFile } from '@fortawesome/free-solid-svg-icons';

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
                <div style={styles.button} onClick={this.props.handleShowRender}>
                    <FontAwesomeIcon style={styles.icon} icon={this.props.renderVisible ? faEyeSlash : faEye} />
                    <span>{this.props.renderVisible ? "Hide Render" : "Show Render"}</span>
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