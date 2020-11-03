import React from 'react';

import Tree from './explorer/Tree';
import FileSystem from './explorer/FileSystem';

export default class Navspace extends React.Component {
    render() {
        // let test = FileSystem.getTree('../../../../../KnowledgeBase');
        let test = FileSystem.getTree('./src');

        return (
            <div className="y-scrollable fill-parent">
                <Tree name="src" type="directory" subtree={test['children']} />
            </div>
        );
    }
}