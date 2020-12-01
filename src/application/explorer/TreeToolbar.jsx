import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';

import TreeTextbox from './TreeTextbox';

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
    let [textbox, setTextbox] = useState(false);
    let [clickEvent, setClickEvent] = useState("");

    return (
        <div>
            <div style={style.menu}>
                <FontAwesomeIcon style={style.icon} icon={faPlus} onClick={() => { setTextbox(true); setClickEvent('file'); }} />
                <FontAwesomeIcon style={style.icon} icon={faFolderPlus} onClick={() => { setTextbox(true); setClickEvent('folder'); }} />
            </div>
            <TreeTextbox path={props.path} visible={textbox} setVisible={setTextbox} clickEvent={clickEvent} />
        </div>
    );
};

export default TreeToolbar;