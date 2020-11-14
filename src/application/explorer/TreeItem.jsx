import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder, faFile, faCaretDown, faCaretRight, faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';
import FileSystem from './FileSystem';
import "../css/Explorer.css";
import Tooltip from '../ui/Tooltip';

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
    let [name, setName] = useState("");
    let [clickEvent, setClickEvent] = useState("");
    const [path, setPath] = useState(props.path);

    const node = useRef();

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });

    const getIcon = () => {
        if (props.type === "file") return faFile;
        if (props.expanded === true) return faFolderOpen;
        return faFolder;
    }

    const handleChange = (event) => {
        event.stopPropagation();
        setName(event.target.value);
        if (clickEvent === 'file' && event.target.value.includes(".")) {
            let filename = event.target.value;
            let splitstring = filename.split(".");
            let substring = splitstring[splitstring.length - 1];
            switch (substring) {
                case 'txt': case 'doc': case 'docx':
                case 'pdf': case 'odt': case 'rtf':
                case 'tex': case 'wpd': case 'c':
                case 'pl': case 'class': case 'cpp':
                case 'h': case 'java': case 'py':
                case 'sh': case 'swift': case 'vb':
                case 'php': case 'css': case 'html':
                case 'js': case 'jpeg': case 'png':
                case 'svg': case 'csv':
                    setTextbox(false);
                    FileSystem.newFile(path + '\\' + filename);
                default:
            }
        }
    }

    const keyPress = (event) => {
        if (event.key === 'Enter') {
            setTextbox(false);
            if (clickEvent === 'file')
                FileSystem.newFile(path + '\\' + name);
            else
                FileSystem.newDirectory(path + '\\' + name);
        }
    }

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            return;
        }
        setTextbox(false);
        if (name !== "") {
            if (clickEvent === 'file')
                FileSystem.newFile(path + '\\' + name);
            else
                FileSystem.newDirectory(path + '\\' + name);
        }
    };

    let caret = false;
    if (props.type !== "file") {
        caret = (props.expanded ? faCaretDown : faCaretRight)
    }

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
                <div ref={node}>
                    {textbox && ( //Require: Bugfix to follow file naming conventions
                        <input
                            type="text"
                            onChange={handleChange}
                            onKeyDown={keyPress}
                        />
                    )
                    }
                </div>
            </div>
        </Tooltip>
    );
};

export default TreeItem;