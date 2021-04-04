import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faSearch,
    faCog,
    faStopwatch20,
    faCalendarDay,
    faChevronLeft,
    faWindowRestore,
    faChevronRight,
    faLink,
} from "@fortawesome/free-solid-svg-icons";

import CloudSettings from "../settings/CloudSettings";
import Settings from "../settings/Settings";
import Tooltip from "../ui/Tooltip";

export const navbarWidth = 32; // in px

const style = {
    container: {
        flex: `0 0 ${navbarWidth}px`,
        height: "100%",
        background: "var(--windowFrame)",
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
        paddingBottom: "0.8rem",
    },
    icon: {
        color: "var(--primaryTextColor)",
        width: "90%",
        padding: "25% 5%",
        cursor: "pointer",
    },
};

const Navbar = (props) => {
    let [showSettings, setShowSettings] = useState(false);
    let [showCloudSettings, setShowCloudSettings] = useState(false);

    const toggleSettings = () => {
        setShowCloudSettings(false);
        setShowSettings(!showSettings);
    };

    const toggleCloudSettings = () => {
        setShowSettings(false);
        setShowCloudSettings(!showCloudSettings);
    };

    return (
        <div style={style.container}>
            <div style={style.menu}>
                <Tooltip
                    value={props.navbarActive ? "Collapse" : "Expand"}
                    position="right"
                >
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={
                            props.navbarActive ? faChevronLeft : faChevronRight
                        }
                        onClick={() => props.setNavbarActive((prev) => !prev)}
                    />
                </Tooltip>
                <Tooltip value="Explorer" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faFolderOpen}
                        onClick={() => props.changeSelection("explorer")}
                    />
                </Tooltip>
                <Tooltip value="Search" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faSearch}
                        onClick={() => props.changeSelection("search")}
                    />
                </Tooltip>
                <Tooltip value="Calendar" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faCalendarDay}
                        onClick={() => props.changeSelection("calendar")}
                    />
                </Tooltip>
                <Tooltip value="Pomodoro" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faStopwatch20}
                        onClick={() => props.changeSelection("pomodoro")}
                    />
                </Tooltip>
                <Tooltip value="Projects" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faWindowRestore}
                        onClick={() => props.changeSelection("project")}
                    />
                </Tooltip>
            </div>
            <div style={style.tools}>
                <Tooltip value="Cloud Connections" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faLink}
                        onClick={toggleCloudSettings}
                    />
                </Tooltip>
                <Tooltip value="Settings" position="right">
                    <FontAwesomeIcon
                        style={style.icon}
                        icon={faCog}
                        onClick={toggleSettings}
                    />
                </Tooltip>
            </div>
            {showSettings && <Settings onExit={toggleSettings} />}
            {showCloudSettings && (
                <CloudSettings onExit={toggleCloudSettings} />
            )}
        </div>
    );
};

export default Navbar;
