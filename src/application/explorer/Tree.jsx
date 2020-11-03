import React from 'react';

import TreeItem from './TreeItem';

import '../css/Explorer.css';

export default class Tree extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            type: this.props.type,
            subtree: this.props.subtree,
            expanded: false,
        }
    }

    expandTree = () => {
        if (this.state.type === "file") { // open the file
            
        }
        else { // toggle the tree (folder)
            this.setState({expanded: !this.state.expanded});
        }
    }

    render() {
        return (
            <div>
                <TreeItem type={this.props.type} name={this.props.name} expanded={this.state.expanded} onClick={this.expandTree} />
                <div className="explorerTree">
                    {this.props.subtree && this.state.expanded &&
                        this.props.subtree.map(element => 
                            <Tree name={element['name']} type={element['type']} subtree={element['children']} />
                        )
                    }
                </div>
            </div>
        );
    }
}