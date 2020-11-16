import React, { useState } from 'react';

import Navbar from './Navbar';
import Explorer from '../explorer/Explorer';
import FileSystem from '../explorer/FileSystem';
import UserPreferences from '../settings/UserPreferences';
import Searchbar from '../addons/search/Searchbar';
import Pomodoro from '../addons/pomodoro/Pomodoro';

const style = {
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        height: "100%",
    },
    fillFlex: {
        flex: "1",
        width: "calc(100% - 35px)"
    }
}

const Navspace = (props) => {
    let [selection, setSelection] = useState('explorer');

    let test = FileSystem.getTree(UserPreferences.get('noteStorage'));
    const EXPLORER = <Explorer
        key={test.id}
        id={test.id}
        name={test.name}
        type={test.type}
        path={test.path}
        subtree={test.children}
    />;
    const SEARCH = <Searchbar />;
    const POMODORO = <Pomodoro />

    const showSelection = () => {
        switch (selection) {
            case "explorer": return EXPLORER;
            case "search": return SEARCH;
            case "pomodoro": return POMODORO;
            default: return;
        }
    }

    return (
        <div style={style.container}>
            <Navbar changeSelection={setSelection} />
            <div style={style.fillFlex}>
                {showSelection()}
            </div>
        </div>
    );
}

export default Navspace;