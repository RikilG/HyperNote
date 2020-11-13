import React, { useRef } from 'react';
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
export default class TreeItem extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.state = {
            textbox: false,
            path: this.props.path,
            name: "",
            clickEvent: ""
        }
    }

    getIcon() {
        if (this.props.type === "file") return faFile;
        if (this.props.expanded === true) return faFolderOpen;
        return faFolder;
    }

    handleChange(event) {
        event.stopPropagation();
        this.setState({ name: event.target.value });
        if (this.state.clickEvent === 'file' && event.target.value.includes(".")) {
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
                    this.setState({ textbox: false });
                    FileSystem.newFile(this.state.path + '\\' + filename);
                default:
            }
        }
    }

    keyPress(event) {
        if (event.key === 'Enter') {
            this.setState({ textbox: false });
            if (this.state.clickEvent === 'file')
                FileSystem.newFile(this.state.path + '\\' + this.state.name);
            else
                FileSystem.newDirectory(this.state.path + '\\' + this.state.name);
        }
    }

    render() {
        let caret = false;
        if (this.props.type !== "file") {
            caret = (this.props.expanded ? faCaretDown : faCaretRight)
        }

        return (
            <Tooltip value={this.props.name} position="mouse">
                <div className="textbox-wrapper">
                    <div onClick={this.props.onClick} style={styles.treeItem} className="tree-item">
                        {caret ?
                            <FontAwesomeIcon icon={caret} style={styles.caretIcon} /> :
                            <span style={{ paddingLeft: "12px" }}></span>
                        }
                        <FontAwesomeIcon icon={this.getIcon()} style={styles.icon} />
                        <div className='text'>
                            {this.props.name}
                        </div>
                        {this.props.expanded && this.props.type !== 'file' && (
                            <div style={styles.newIconContainer} className="new-icon-container">
                                <FontAwesomeIcon style={styles.pageIcon} className="page-icon" icon={faPlus} onClick={(e) => { e.stopPropagation(); this.setState({ textbox: true, clickEvent: "file" }); }} />
                                <FontAwesomeIcon style={styles.folderIcon} className="folder-icon" icon={faFolderPlus} onClick={(e) => { e.stopPropagation(); this.setState({ textbox: true, clickEvent: "folder" }) }} />
                            </div>)
                        }
                    </div>
                    {this.state.textbox && ( //Require: Bugfix to follow file naming conventions
                        <input
                            type="text"
                            onChange={this.handleChange}
                            onKeyDown={this.keyPress}
                        />
                    )
                    }
                </div>
            </Tooltip>
        );
    }
}