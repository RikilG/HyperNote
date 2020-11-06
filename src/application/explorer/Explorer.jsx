import React from 'react';

import TreeToolbar from './TreeToolbar';
import Tree from './Tree';

const style = {
    explorer: {
        height: "5px",
        display: "flex",
        flexFlow: "column nowrap",
    }
}
const Explorer = (props) => {
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
                openFile={props.openFile}
            />
        </div>
    );
};

export default Explorer