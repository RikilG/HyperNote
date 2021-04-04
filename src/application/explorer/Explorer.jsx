import React, { useContext, useEffect, useState } from "react";

import Tree from "./Tree";
import TreeToolbar from "./TreeToolbar";
import WindowContext from "../WindowContext";
import StorageContext from "../storage/StorageContext";

const style = {
    explorer: {
        display: "flex",
        flexFlow: "column nowrap",
        flex: "1",
        maxWidth: "100%",
    },
    header: {
        fontSize: "1.5rem",
        padding: "0.2rem 0.6rem",
        color: "var(--primaryColor)",
    },
    tree: {
        // height: "calc(var(--windowHeight) - 150px)",
        overflowY: "auto",
        overflowX: "hidden",
        flex: "1",
    },
};

const ExplorerContext = React.createContext({
    refreshTree: () => {},
});

const Explorer = (props) => {
    const { fileSystem, userPreferences } = useContext(StorageContext);
    const { openWindow } = useContext(WindowContext);
    let [tree, setTree] = useState({});

    const refreshTree = () => {
        // TODO: make getTree() async to remove file system parsing from main thread
        // TODO: modify prevTree from setTree (using func syntax of setState) to reduce disk load
        // TODO: sort the resulting tree to show folders first and next files
        setTree(fileSystem.getTree());
    };

    useEffect(() => {
        refreshTree();
    }, []);

    return (
        <div style={style.explorer}>
            <ExplorerContext.Provider value={{ refreshTree }}>
                <div style={style.header}>Explorer</div>
                <TreeToolbar path={tree.path} />
                <div style={style.tree}>
                    <Tree
                        key={tree.id}
                        treeObj={tree}
                        openWindow={openWindow}
                        root={true}
                    />
                </div>
            </ExplorerContext.Provider>
        </div>
    );
};

export default Explorer;
export { ExplorerContext };
