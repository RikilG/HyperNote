import React, { useState } from "react";

import "../css/Explorer.css";
import TreeItem from "./TreeItem";
import EditorGroup from "../editor/EditorGroup";

const Tree = (props) => {
    let [expanded, setExpanded] = useState(false);
    let { type, name, path, id, subtree } = props.treeObj;

    const expandTree = () => {
        if (type === "file") {
            // open the file
            let file = {
                addon: "notes",
                name: name,
                path: path,
                id: id,
                page: undefined,
            };
            file.page = <EditorGroup key={file.id} fileObj={file} />;
            props.openWindow(file);
        } else {
            // toggle the tree (folder)
            setExpanded((prevState) => !prevState);
        }
    };

    return (
        <>
            {!props.root && (
                <TreeItem
                    key={"item" + id}
                    type={type}
                    name={name}
                    expanded={expanded}
                    path={path}
                    onClick={expandTree}
                />
            )}
            <div className={props.root ? "" : "explorerTree"}>
                {subtree &&
                    (props.root || expanded) &&
                    subtree.map((element) => (
                        <Tree
                            key={element.id}
                            treeObj={element}
                            openWindow={props.openWindow}
                        />
                    ))}
            </div>
        </>
    );
};

export default Tree;
