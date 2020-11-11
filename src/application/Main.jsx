import React, { useState } from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane'; // ignore error, no types for typescript

import Navspace from './navspace/Navspace';
import Workspace from './workspace/Workspace';

import 'react-toastify/dist/ReactToastify.css';
import './css/AppStyle.css';
import './css/SplitPane.css';
import WindowContext from './WindowContext';

const Main = (props) => {
    let [windowList, setWindowList] = useState([]);

    const openWindow = (fileObj) => {
        let alreadyOpen = false;
    
        windowList.forEach((val) => {
            if (val.path === fileObj.path) alreadyOpen = true;
        })
    
        if (!alreadyOpen) {
            let openFiles = windowList.concat(fileObj);
            setWindowList(openFiles);
        }
    }
    
    const closeWindow = (filepath) => {
        let index = windowList.indexOf(filepath);
        if (index !== -1) {
            let otherFiles = [...windowList];
            otherFiles.splice(index, 1);
            setWindowList(otherFiles);
        }
    }

    return (
        <WindowContext.Provider value={{ windowList, openWindow, closeWindow }}>
            <SplitPane split="vertical">
                <Pane minSize="120px" maxSize="50%" initialSize="225px">
                    <Navspace />
                </Pane>
                <Pane minSize="50px">
                    <Workspace />
                </Pane>
            </SplitPane>
        </WindowContext.Provider>
    );
}

export default Main;