import React, { useState } from 'react';

const WindowContext = React.createContext({
    windowList: {},
    openWindow: () => {},
    closeWindow: () => {},
});

export default WindowContext;

export const WindowContextWrapper = ({ children }) => {
    let [windowList, setWindowList] = useState({
        notes: [],
        pomodoro: [],
    });

    const openWindow = (winObj) => {
        let alreadyOpen = false;
        let addon = winObj.addon;
        let openWindows = windowList[addon];
        
        openWindows.forEach((val) => {
            if (val.id === winObj.id) alreadyOpen = true;  
        })
        
        if (!alreadyOpen) {
            let newList = [...windowList[addon], winObj];
            setWindowList(prevState => ({...prevState, [addon]: newList}));
        }
    }
    
    const closeWindow = (winObj) => {
        let addon = winObj.addon;
        let index = windowList[addon].indexOf(winObj);
        if (index !== -1) {
            let otherFiles = [...windowList[addon]];
            otherFiles.splice(index, 1);
            setWindowList(prevState => ({...prevState, [addon]: otherFiles}));
        }
    }

    return (
        <WindowContext.Provider value={{ windowList, openWindow, closeWindow }}>
            {children}
        </WindowContext.Provider>
    );
}