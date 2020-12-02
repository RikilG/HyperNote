import React, { useState } from "react";

import Navbar from "./Navbar";
import Explorer from "../explorer/Explorer";
import Searchbar from "../addons/search/Searchbar";
import Pomodoro from "../addons/pomodoro/PomodoroNav";
import Project from "../addons/projectBoard/Project";

const style = {
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        height: "100%",
    },
    fillFlex: {
        flex: "1",
        width: "calc(100% - 35px)",
    },
};

const Navspace = (props) => {
    let [selection, setSelection] = useState("explorer");

    // TODO: convert these into an abject and index with strings directly instead of switch case
    const EXPLORER = <Explorer />;
    const SEARCH = <Searchbar />;
    const POMODORO = <Pomodoro />;
    const PROJECT = <Project />;

    const showSelection = () => {
        switch (selection) {
            case "explorer":
                return EXPLORER;
            case "search":
                return SEARCH;
            case "pomodoro":
                return POMODORO;
            case "project":
                return PROJECT;
            default:
                return;
        }
    };

    return (
        <div style={style.container}>
            <Navbar changeSelection={setSelection} />
            <div style={style.fillFlex}>{showSelection()}</div>
        </div>
    );
};

export default Navspace;
