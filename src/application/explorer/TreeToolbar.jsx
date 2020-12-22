import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderPlus,
    faPlus,
    faRedo,
} from "@fortawesome/free-solid-svg-icons";

import TreeTextbox from "./TreeTextbox";
import { ExplorerContext } from "./Explorer";
import Tooltip from "../ui/Tooltip";

const style = {
    menu: {
        display: "flex",
        flexFlow: "row wrap",
        flex: "1",
        margin: "0.1rem 0.2rem",
        justifyContent: "space-evenly",
        borderTop: "2px solid var(--dividerColor)",
        borderBottom: "2px solid var(--dividerColor)",
    },
    icon: {
        padding: "0.3rem",
        cursor: "pointer",
    },
};

const TreeToolbar = (props) => {
    let [textbox, setTextbox] = useState(false);
    let [clickEvent, setClickEvent] = useState("");
    const { refreshTree } = useContext(ExplorerContext);

    return (
        <div>
            <div style={style.menu}>
                <div
                    style={style.icon}
                    onClick={() => {
                        setTextbox(true);
                        setClickEvent("file");
                    }}
                >
                    <Tooltip value="New File" position="bottom">
                        <FontAwesomeIcon icon={faPlus} />
                    </Tooltip>
                </div>
                <div
                    style={style.icon}
                    onClick={() => {
                        setTextbox(true);
                        setClickEvent("folder");
                    }}
                >
                    <Tooltip value="New Folder" position="bottom">
                        <FontAwesomeIcon icon={faFolderPlus} />
                    </Tooltip>
                </div>
                <div
                    style={style.icon}
                    onClick={() => {
                        refreshTree();
                    }}
                >
                    <Tooltip value="Refresh" position="bottom">
                        <FontAwesomeIcon icon={faRedo} />
                    </Tooltip>
                </div>
            </div>
            <TreeTextbox
                path={props.path}
                visible={textbox}
                setVisible={setTextbox}
                clickEvent={clickEvent}
            />
        </div>
    );
};

export default TreeToolbar;
