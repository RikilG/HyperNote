import { useContext } from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import InfoPane from './InfoPane';
import WindowContext from '../WindowContext';

const Workspace = () => {
    const { windowList } = useContext(WindowContext);

    const loadWindows = () => {
        let addonWindows = [];
        for (let addon in windowList) {
            addonWindows = addonWindows.concat(windowList[addon]);
        }

        if (addonWindows.length > 0) {
            return addonWindows.map((winObj) => 
                <Pane minSize="50px" key={winObj.id} >
                    {winObj.page}
                </Pane>
            );
        }
        else {
            return [<Pane minSize="50px" key={0}>
                <InfoPane />
            </Pane>];
        }
    }

    return (
        <SplitPane split="horizontal">
            {loadWindows()}
        </SplitPane>
    );
}

export default Workspace;