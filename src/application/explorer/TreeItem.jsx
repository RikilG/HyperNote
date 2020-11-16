import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder, faFile, faCaretDown, faCaretRight, faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';

import "../css/Explorer.css";
import Tooltip from '../ui/Tooltip';
import TreeTextbox from './TreeTextbox';

const styles = {
    treeItem: {
        display: "flex",
        flexFlow: "row nowrap",
        cursor: "pointer"
    },
    caretIcon: {
        marginLeft: "5px"
    },
    icon: {
        margin: "0 5px"
    },
    newIconContainer: {
        display: "flex",
        flexFlow: "row nowrap",
        position: "absolute",
        right: "5px",
        zIndex: '1'
    },
    pageIcon: {
        cursor: "pointer"
    },
    folderIcon: {
        cursor: "pointer",
        position: "relative",
        marginLeft: "10px"
    }
}

const TreeItem = (props) => {
    let [textbox, setTextbox] = useState(false);
    let [clickEvent, setClickEvent] = useState("");
    let [caret, setCaret] = useState(false);

    const getIcon = () => {
        if (props.type === "file") return faFile;
        if (props.expanded === true) return faFolderOpen;
        return faFolder;
    }
    
    useEffect(() => {
        if (props.type !== "file") {
            setCaret(props.expanded ? faCaretDown : faCaretRight);
        }
    }, [props.expanded, props.type])

    return (
        <Tooltip value={props.name} position="mouse">
            <div className="textbox-wrapper">
                <div onClick={props.onClick} style={styles.treeItem} className="tree-item">
                    {caret ?
                        <FontAwesomeIcon icon={caret} style={styles.caretIcon} /> :
                        <span style={{ paddingLeft: "12px" }}></span>
                    }
                    <FontAwesomeIcon icon={getIcon()} style={styles.icon} />
                    <div className='text'>
                        {props.name}
                    </div>
                    {props.expanded && props.type !== 'file' && (
                        <div style={styles.newIconContainer} className="new-icon-container">
                            <FontAwesomeIcon style={styles.pageIcon} className="page-icon" icon={faPlus} onClick={(e) => { e.stopPropagation(); setTextbox(true); setClickEvent('file'); }} />
                            <FontAwesomeIcon style={styles.folderIcon} className="folder-icon" icon={faFolderPlus} onClick={(e) => { e.stopPropagation(); setTextbox(true); setClickEvent('folder'); }} />
                        </div>)
                    }
                </div>
                <TreeTextbox path={props.path} textbox={textbox} setTextbox={setTextbox} clickEvent={clickEvent} />
            </div>
        </Tooltip>
    );
};

export default TreeItem;