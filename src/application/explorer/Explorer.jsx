import React, { useContext, useEffect, useRef, useState } from "react";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import Tree from "./Tree";
import TreeToolbar from "./TreeToolbar";
import WindowContext from "../WindowContext";
import FileSystem from "../explorer/FileSystem";
import UserPreferences from "../settings/UserPreferences";
import ContextMenu from "../ui/ContextMenu";

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
    const { openWindow } = useContext(WindowContext);
    let [tree, setTree] = useState({});
    const explorerRef = useRef(null);

    const contextMenuOptions = [
        {
            name: "rename",
            icon: faPen,
            action: (target) => console.log("rename", target),
        },
        {
            name: "delete",
            icon: faTrash,
            action: (target) => console.log("delete", target),
        },
    ];

    const refreshTree = () => {
        // TODO: make getTree() async to remove file system parsing from main thread
        // TODO: modify prevTree from setTree (using func syntax of setState) to reduce disk load
        // TODO: sort the resulting tree to show folders first and next files
        setTree(FileSystem.getTree(UserPreferences.get("noteStorage")));
    };

    useEffect(() => {
        refreshTree();
    }, []);

    const getContextMenuBounds = () => {
        if (!explorerRef.current) return {};
        return explorerRef.current.getBoundingClientRect();
    };

    return (
        <div style={style.explorer}>
            <ExplorerContext.Provider value={{ refreshTree }}>
                <div style={style.header}>Explorer</div>
                <TreeToolbar path={tree.path} />
                <div style={style.tree} ref={explorerRef}>
                    <Tree
                        key={tree.id}
                        treeObj={tree}
                        openWindow={openWindow}
                        root={true}
                    />
                </div>
                <ContextMenu
                    bounds={getContextMenuBounds()}
                    menu={contextMenuOptions}
                />
            </ExplorerContext.Provider>
        </div>
    );
};

export default Explorer;
export { ExplorerContext };
