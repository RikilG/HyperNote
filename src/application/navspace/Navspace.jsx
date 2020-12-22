import React from "react";

// import Navbar from "./Navbar";
import Explorer from "../explorer/Explorer";
import Searchbar from "../addons/search/Searchbar";
import Pomodoro from "../addons/pomodoro/PomodoroNav";
import Project from "../addons/projectBoard/Project";
import Calendar from "../addons/calendar/CalendarNav";

const style = {
    fillFlex: {
        display: "flex",
        flexFlow: "row nowrap",
        height: "100%",
        // width: "calc(100% - 35px)",
        width: "100%",
        // overflowX: "hidden",
    },
};

const Navspace = (props) => {
    const { addon } = props;
    // TODO: convert these into an abject and index with strings directly instead of switch case
    const addons = {
        explorer: <Explorer />,
        search: <Searchbar />,
        pomodoro: <Pomodoro />,
        project: <Project />,
        calendar: <Calendar />,
    };

    const showSelection = () => {
        if (addons[addon]) {
            return addons[addon];
        }
        return;
    };

    return <div style={style.fillFlex}>{showSelection()}</div>;
};

export default Navspace;
