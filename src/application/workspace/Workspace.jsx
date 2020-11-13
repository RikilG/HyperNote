import { useContext } from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import WorksapceWindow from './WorkspaceWindow';
import InfoPane from './InfoPane';
import WindowContext from '../WindowContext';

const Workspace = () => {
    const { windowList } = useContext(WindowContext);

    return (
        <SplitPane split="horizontal">
            {
                (windowList && windowList.length > 0)
                    ? windowList.map((fileObj, idx) => 
                        <Pane minSize="50px" key={fileObj.id} >
                            <WorksapceWindow key={fileObj.id} fileObj={fileObj} />
                        </Pane>
                    )
                    : [<Pane minSize="50px" key={0}>
                        <InfoPane />
                    </Pane>]
            }
        </SplitPane>
    );
}

export default Workspace;