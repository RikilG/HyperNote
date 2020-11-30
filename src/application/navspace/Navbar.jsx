import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faSearch, faCog, faStopwatch20, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

import Settings from '../settings/Settings';
import Tooltip from '../ui/Tooltip';

const style = {
    container: {
        flex: "0 0 35px",
        height: "100%",
        background: "var(--backgroundAccent)",
        display: "flex",
        flexFlow: "column nowrap",
    },
    menu: {
        display: "flex",
        flexFlow: "column",
        flex: "1",
    },
    tools: {
        display: "flex",
        flexFlow: "column",
        paddingBottom: "1rem",
    },
    icon: {
        width: "90%",
        padding: "25% 5%",
        cursor: "pointer",
    },
}

const Navbar = (props) => {
    let [showSettings, setShowSettings] = useState(false);

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    }

    return (
        <div style={style.container}>
            <div style={style.menu}>
                <Tooltip value="Explorer" position="right">
                    <FontAwesomeIcon style={style.icon} icon={faFolderOpen} onClick={() => props.changeSelection("explorer")} />
                </Tooltip>
                <Tooltip value="Search" position="right">
                    <FontAwesomeIcon style={style.icon} icon={faSearch} onClick={() => props.changeSelection("search")} />
                </Tooltip>
                <Tooltip value="Pomodoro" position="right">
                    <FontAwesomeIcon style={style.icon} icon={faStopwatch20} onClick={() => props.changeSelection("pomodoro")} />
                </Tooltip>
                <Tooltip value="Project" position="right">
                    <FontAwesomeIcon style={style.icon} icon={faWindowRestore} onClick={() => props.changeSelection("project")} />
                </Tooltip>
            </div>
            <div style={style.tools}>
                <Tooltip value="Settings" position="right">
                    <FontAwesomeIcon style={style.icon} icon={faCog} onClick={toggleSettings} />
                </Tooltip>
            </div>
            {showSettings && <Settings onExit={toggleSettings} />}
        </div>
    );
};

export default Navbar;