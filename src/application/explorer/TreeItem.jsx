import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';

export default class TreeItem extends React.Component {
    getIcon() {
        if (this.props.type === "file") return faFile;
        if (this.props.expanded === true) return faFolderOpen;
        return faFolder;
    }

    render() {
        return (
            <div onClick={this.props.onClick} className="tree-item">
                {/* {type == 'directory' && expander} */}
                {/* {this.props.icon} */}
                <FontAwesomeIcon icon={this.getIcon()} style={{margin:"0 5px"}} />
                {this.props.name}
            </div>
        );
    }
}