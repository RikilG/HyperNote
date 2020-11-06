import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

const style = {
    menu: {
        display: "flex",
        flexFlow: "row",
        flex: "1"
    },
    icon: {
        width: "40%",
        height: "40px",
        padding: "10% 5%",
        cursor: "pointer",
    }
}

const TreeToolbar = (props) => {
    return (
        <div style={style.menu}>
            <FontAwesomeIcon style={style.icon} icon={faPlusSquare} onClick={() => { }} />
            <FontAwesomeIcon style={style.icon} icon={faFolderPlus} onClick={() => { }} />
        </div>
    );
};

export default TreeToolbar;