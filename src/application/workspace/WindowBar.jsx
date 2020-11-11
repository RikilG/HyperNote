import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import Tooltip from '../ui/Tooltip';
import WindowContext from '../WindowContext';

const style = {
    bar: {
        padding: "0.2rem",
        position: "relative",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.3rem",
    },
    closeButton: {
        padding: "0.2rem",
        cursor: "pointer",
        position: "absolute",
        right: "0",
    },
};

const WindowBar = (props) => {
    const { closeWindow } = useContext(WindowContext);

    return (
        <div style={style.bar}>
            <Tooltip style={style.closeButton} value="close" position="bottom">
                <FontAwesomeIcon icon={faTimes} onClick={() => closeWindow(props.winObj)} />
            </Tooltip>
            <div style={style.title}>{props.title}</div>
        </div>
    );
}

export default WindowBar;