import React, { useContext, useEffect, useState } from 'react';

import Tree from './Tree';
import TreeToolbar from './TreeToolbar';
import WindowContext from '../WindowContext';
import FileSystem from '../explorer/FileSystem';
import UserPreferences from '../settings/UserPreferences';

const style = {
    explorer: {
        height: "5px",
        display: "flex",
        flexFlow: "column nowrap",
        position: "relative"
    },
    header: {
        fontSize: "1.5rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
    },
}

const ExplorerContext = React.createContext({
    refreshTree: () => {},
});

const Explorer = (props) => {
    const { openWindow } = useContext(WindowContext);
    let [ tree, setTree ] = useState({});

    const refreshTree = () => {
        // TODO: make getTree() async to remove file system parsing from main thread
        // TODO: modify prevTree from setTree (using func syntax of setState) to reduce disk load
        // TODO: sort the resulting tree to show folders first and next files
        setTree(FileSystem.getTree(UserPreferences.get('noteStorage')));
    }

    useEffect(() => {
        refreshTree();
    }, []);

    return (
        <div style={style.explorer}>
            <ExplorerContext.Provider value={{ refreshTree }}>
                <div style={style.header}>Explorer</div>
                <TreeToolbar path={tree.path} />
                <Tree
                    key={tree.id}
                    treeObj={tree}
                    openWindow={openWindow}
                    root={true}
                />
            </ExplorerContext.Provider>
        </div>
    );
};

export default Explorer;
export { ExplorerContext };