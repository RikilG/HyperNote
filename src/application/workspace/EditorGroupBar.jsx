import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

let styles = {
    icon: {
        margin: "0 5px",
    },
    button: {
        cursor: "pointer",
    },
};

export default class EditorGroupBar extends React.Component {
    render() {
        return (
            <div style={styles.button} onClick={this.props.handleShowRender}>
                <FontAwesomeIcon style={styles.icon} icon={this.props.renderVisible ? faEyeSlash : faEye} />
                <span>{this.props.renderVisible ? "Hide Render" : "Show Render"}</span>
            </div>
        );
    }
}