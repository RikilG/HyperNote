import React from 'react';

import Tree from './explorer/Tree';
import FileSystem from './explorer/FileSystem';

export class Navspace extends React.Component {
    render() {
        let test = FileSystem.getTree('.');

        return (
            <div className="y-scrollable fill-parent">
                <Tree name="." type="directory" subtree={test['children']} />
            </div>
        );
    }
}