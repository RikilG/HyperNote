import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
// import { faFolderOpen, faFolder, faFile } from '@fortawesome/free-regular-svg-icons';

export default class TreeItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            type: this.props.type,
            icon: (this.props.type === "file" ? faFile : faFolder),
        }
    }

    getIcon() {
        if (this.props.type === "file") return faFile;
        if (this.props.expanded == true) return faFolderOpen;
        return faFolder;
    }

    render() {
        return (
            <div onClick={this.props.onClick} className="tree-item">
                {/* {type == 'directory' && expander} */}
                {/* {this.props.icon} */}
                <FontAwesomeIcon icon={this.getIcon()} style={{marginRight:"5px"}} />
                {this.props.name}
            </div>
        );
    }
}