import React, {
    useState,
    useEffect,
    useRef,
    useContext,
    useCallback,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFolderOpen,
    faFolder,
    faFile,
    faCaretDown,
    faCaretRight,
    faFolderPlus,
    faPlus,
    faPen,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';

import "../css/Explorer.css";
import Tooltip from "../ui/Tooltip";
import Textbox from "../ui/Textbox";
import TreeTextbox from "./TreeTextbox";
import ContextMenu from "../ui/ContextMenu";
import StorageContext from "../storage/StorageContext";
import { ExplorerContext } from "./Explorer";
import { toast } from "react-toastify";

const styles = {
    treeItem: {
        display: "flex",
        flexFlow: "row nowrap",
        cursor: "pointer",
        padding: "0.15rem",
        margin: "0 0.15rem 0 0",
        borderRadius: "0.3rem",
        position: "relative",
        alignItems: "center",
    },
    caretIcon: {
        margin: "1px 0 0 5px",
    },
    fileIcon: {
        margin: "0 5px",
    },
    newIconContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        position: "absolute",
        right: "7px",
        zIndex: "1",
    },
    newIcon: {
        cursor: "pointer",
        position: "relative",
        margin: "2px 5px",
    },
    text: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        userSelect: "none",
    },
};

function useHookWithRefCallback() {
    // for the original useHookWIthRefCallback, go here:
    // https://gist.github.com/thebuilder/fb07c989093d4a82811625de361884e7
    const [bounds, setBounds] = useState({});
    const ref = useRef(null);
    const setRef = useCallback((node) => {
        if (node) {
            setBounds(node.getBoundingClientRect());
        }

        ref.current = node;
    }, []);

    return [setRef, bounds];
}

const TreeItem = (props) => {
    let [textbox, setTextbox] = useState(false);
    let [isEditable, setIsEditable] = useState(false);
    let [clickEvent, setClickEvent] = useState("");
    let [caret, setCaret] = useState(null);
    let [setContextMenuRef, bounds] = useHookWithRefCallback();
    const { refreshTree } = useContext(ExplorerContext);
    const { fileSystem } = useContext(StorageContext);

    const contextMenuOptions = [
        {
            name: "rename",
            icon: faPen,
            action: () => setIsEditable(true),
        },
        {
            name: "delete",
            icon: faTrash,
            action: () => {
                fileSystem.delete(props.path).then((data) => {
                    if (data && data.status !== 200) {
                        toast.error("Unable to delete");
                    } else {
                        toast("Deleted successfully");
                        refreshTree();
                    }
                });
            },
        },
    ];

    const getIcon = () => {
        if (props.type === "file") return faFile;
        if (props.expanded === true) return faFolderOpen;
        return faFolder;
    };

    const handleRenameConfirm = (newName) => {
        if (newName !== "") {
            const newPath = fileSystem.join(
                fileSystem.dirname(props.path),
                newName
            );
            fileSystem.rename(props.path, newPath);
            refreshTree();
        }
    };

    const handleRenameCancel = (newName, type) => {
        return props.name;
    };

    useEffect(() => {
        if (props.type !== "file") {
            setCaret(props.expanded ? faCaretDown : faCaretRight);
        } else {
            setCaret(null);
        }
    }, [props.expanded, props.type]);

    return (
        <Tooltip value={props.name} position="mouse">
            <div>
                <div
                    onClick={(e) => !isEditable && props.onClick(e)}
                    style={styles.treeItem}
                    className="tree-item"
                    ref={setContextMenuRef}
                >
                    {caret ? (
                        <FontAwesomeIcon
                            icon={caret}
                            style={styles.caretIcon}
                        />
                    ) : (
                        <span style={{ paddingLeft: "12px" }}></span>
                    )}
                    <FontAwesomeIcon icon={getIcon()} style={styles.fileIcon} />
                    {isEditable ? (
                        <Textbox
                            initialValue={props.name}
                            visible={isEditable}
                            setVisible={setIsEditable}
                            handleConfirm={handleRenameConfirm}
                            handleCancel={handleRenameCancel}
                        />
                    ) : (
                        <div style={styles.text}>{props.name}</div>
                    )}
                    {!isEditable && props.type !== "file" && (
                        <div
                            style={styles.newIconContainer}
                            className="new-icon-container"
                        >
                            <FontAwesomeIcon
                                style={styles.newIcon}
                                icon={faPlus}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTextbox(true);
                                    setClickEvent("file");
                                }}
                            />
                            <FontAwesomeIcon
                                style={styles.newIcon}
                                icon={faFolderPlus}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTextbox(true);
                                    setClickEvent("folder");
                                }}
                            />
                        </div>
                    )}
                </div>
                {textbox && (
                    <TreeTextbox
                        path={props.path}
                        visible={textbox}
                        setVisible={setTextbox}
                        clickEvent={clickEvent}
                    />
                )}
                <ContextMenu bounds={bounds} menu={contextMenuOptions} />
            </div>
        </Tooltip>
    );
};

export default TreeItem;
