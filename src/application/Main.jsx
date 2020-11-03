import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane'; // ignore error, no types for typescript

import Navspace from './Navspace';
import Workspace from './workspace/Workspace';

import './css/SplitPane.css'

export default class Main extends React.Component {
    render() {
        return (
            <SplitPane split="vertical">
                <Pane minSize="120px" maxSize="50%" initialSize="180px">
                    <Navspace />
                </Pane>
                <Pane minSize="50px">
                    <Workspace />
                </Pane>
            </SplitPane>
        );
    }
}