import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import EditorGroup from './EditorGroup';

export default class Workspace extends React.Component {
    render() {
        return (
            <EditorGroup />
        );
    }
}