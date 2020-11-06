import React from 'react';

import TreeToolbar from './TreeToolbar';
import Tree from './Tree';

const style = {
    container: {
        height: "5px",
        background: "var(--backgroundAccent)",
        display: "flex",
        flexFlow: "column nowrap",
    }
}
const Explorer = (props) => {
    return (
        <div style={style.container}>
            <TreeToolbar />
            <Tree
                key={props.key}
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