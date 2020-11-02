import React from 'react';
import SplitPane from 'react-split-pane';
// import Pane from 'react-split-pane/lib/Pane';

import Editor from './editor/Editor';
import Viewer from './viewer/Viewer';

export class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '# Hello!'
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <SplitPane>
                <Editor value={this.state.value} handleChange={this.handleChange}/>
                <Viewer value={this.state.value} />
            </SplitPane>
        );
    }
}