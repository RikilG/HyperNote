import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';

const style = {
    menu: {
        display: "flex",
        flexFlow: "row",
        flex: "1",
        justifyContent: "space-evenly",
        borderColor: "var(--backgroundAccent)",
        marginBottom: '0.3rem',
        borderTop: "0",
        borderLeft: "0"
    },
    icon: {
        padding: '0.4rem',
        cursor: "pointer",
    }
}

const TreeToolbar = (props) => {
    return (
        <div style={style.menu}>
            <FontAwesomeIcon style={style.icon} icon={faPlus} onClick={() => { }} />
            <FontAwesomeIcon style={style.icon} icon={faFolderPlus} onClick={() => { }} />
        </div>
    );
};

export default TreeToolbar;