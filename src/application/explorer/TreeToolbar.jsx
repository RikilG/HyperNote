import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';

const style = {
    menu: {
        display: "flex",
        flexFlow: "row",
        flex: "1",
        borderStyle: 'solid',
        borderColor: 'black'
    },
    icon: {
        width: "35%",
        height: "40px",
        padding: "10% 5%",
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