import React, { useContext } from 'react';

import TreeToolbar from './TreeToolbar';
import Tree from './Tree';
import WindowContext from '../WindowContext';

const style = {
    explorer: {
        height: "5px",
        display: "flex",
        flexFlow: "column nowrap",
        position: "relative"
    }
}
const Explorer = (props) => {
    const { openWindow } = useContext(WindowContext);
    return (
        <div style={style.explorer}>
            <TreeToolbar />
            <Tree
                key={props.id}
                id={props.id}
                name={props.name}
                type={props.type}
                path={props.path}
                subtree={props.subtree}
                openFile={openWindow}
            />
        </div>
    );
};

export default Explorer