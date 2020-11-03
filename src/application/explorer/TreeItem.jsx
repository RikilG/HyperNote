import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder, faFile, faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';

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
            <div onClick={this.props.onClick} className="tree-item">
                {caret ? 
                    <FontAwesomeIcon icon={caret} style={{marginLeft:"5px"}} /> : 
                    <span style={{paddingLeft: "12px"}}></span>
                }
                <FontAwesomeIcon icon={this.getIcon()} style={{margin:"0 5px"}} />
                {this.props.name}
            </div>
        );
    }
}