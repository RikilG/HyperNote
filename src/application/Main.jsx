import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane'; // ignore error, no types for typescript

import Navspace from './navspace/Navspace';
import Workspace from './workspace/Workspace';

import './css/AppStyle.css';
import './css/SplitPane.css';

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openFiles: [],
        }
    }

    openFile = (fileObj) => {
        let fileAlreadyOpen = false;

        this.state.openFiles.forEach((val, ind) => {
            if (val.path === fileObj.path) fileAlreadyOpen = true;
        })

        if (!fileAlreadyOpen) {
            let openFiles = this.state.openFiles.concat(fileObj);
            this.setState({openFiles: openFiles});
        }
    }

    closeFile = (filepath) => {
        let index = this.state.openFiles.indexOf(filepath);
        if (index !== -1) {
            let otherFiles = [...this.state.openFiles];
            otherFiles.splice(index, 1);
            this.setState({openFiles: otherFiles});
        }
    }

    render() {
        return (
            <SplitPane split="vertical">
                <Pane minSize="120px" maxSize="50%" initialSize="180px">
                    <Navspace openFile={this.openFile} />
                </Pane>
                <Pane minSize="50px">
                    <Workspace openFiles={this.state.openFiles} closeFile={this.closeFile} />
                </Pane>
            </SplitPane>
        );
    }
}