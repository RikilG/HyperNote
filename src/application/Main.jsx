import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import Navspace from './navspace/Navspace';
import Workspace from './workspace/Workspace';

import 'react-toastify/dist/ReactToastify.css';
import './css/AppStyle.css';
import './css/SplitPane.css';
import { WindowContextWrapper } from './WindowContext';

const Main = () => {
    return (
        <WindowContextWrapper>
            <SplitPane split="vertical">
                <Pane minSize="120px" maxSize="50%" initialSize="225px">
                    <Navspace />
                </Pane>
                <Pane minSize="50px">
                    <Workspace />
                </Pane>
            </SplitPane>
        </WindowContextWrapper>
    );
}

export default Main;