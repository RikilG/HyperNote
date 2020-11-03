import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import Editor from '../editor/Editor';
import Renderer from '../renderer/Renderer';
import EditorGroupBar from './EditorGroupBar';

export default class EditorGroup extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: '# Hello!',
            showRender: false,
        }
    }

    handleTextChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleShowRender = () => {
        this.setState({showRender: !this.state.showRender});
    }

    render() {
        return (
            <div className="fill-parent">
                <EditorGroupBar renderVisible={this.state.showRender} handleShowRender={this.handleShowRender} />
                <SplitPane>
                    <Pane minSize="50px">
                        <Editor value={this.state.value} handleChange={this.handleTextChange}/>
                    </Pane>
                    {this.state.showRender && 
                        <Pane minSize="50px">
                            <Renderer value={this.state.value} />
                        </Pane>
                    }
                </SplitPane>
            </div>
        );
    }
}