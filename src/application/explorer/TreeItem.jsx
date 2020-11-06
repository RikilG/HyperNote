import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder, faFile, faCaretDown, faCaretRight, faFolderPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';
import "../css/Explorer.css";
const styles = {
    treeItem: {
        display: "flex",
        flexFlow: "row nowrap",
        cursor: "pointer"
    },
    caretIcon: {
        marginLeft: "5px"
    },
    Icon: {
        margin: "0 5px"
    },
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        position: "relative",
        left: "20%"
    },
    pageIcon: {
        cursor: "pointer"
    },
    folderIcon: {
        cursor: "pointer",
        position: "relative",
        marginLeft: "15%"
    }
}
export default class TreeItem extends React.Component {
    getIcon() {
        if (this.props.type === "file") return faFile;
        if (this.props.expanded === true) return faFolderOpen;
        return faFolder;
    }

    render() {
        let caret = false;
        if (this.props.type !== "file") {
            caret = (this.props.expanded ? faCaretDown : faCaretRight)
        }

        return (
            <div onClick={this.props.onClick} style={styles.treeItem} className="tree-item">
                {caret ?
                    <FontAwesomeIcon icon={caret} style={styles.caretIcon} /> :
                    <span style={{ paddingLeft: "12px" }}></span>
                }
                <FontAwesomeIcon icon={this.getIcon()} style={styles.Icon} />
                {this.props.name}
                {this.props.expanded && this.props.type !== 'file' && (
                    <div style={styles.container} className="container">
                        <FontAwesomeIcon style={styles.pageIcon} className="page-icon" icon={faPlusSquare} onClick={(e) => { e.stopPropagation(); console.log("clicked new page"); }} />
                        <FontAwesomeIcon style={styles.folderIcon} className="folder-icon" icon={faFolderPlus} onClick={(e) => { e.stopPropagation(); console.log("clicked new folder") }} />
                    </div>)
                }
            </div>
        );
    }
}