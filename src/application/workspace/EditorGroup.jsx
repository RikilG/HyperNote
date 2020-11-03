import React from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import Editor from '../editor/Editor';
import Renderer from '../renderer/Renderer';
import EditorGroupBar from './EditorGroupBar';
import FileSystem from '../explorer/FileSystem';

const style = {
    container: {
        display: "flex",
        flexFlow: "column",
    },
    fill: {
        flex: "1",
    }
}

export default class EditorGroup extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            value: '# Hello!',
            showRender: false,
            modified: false,
        }
    }

    componentDidMount() {
        if (this.props.fileObj) {
            this.setState({
                value: FileSystem.readFile(this.props.fileObj.path)
            });
        }
    }

    handleTextChange = (event) => {
        this.setState({
            value: event.target.value,
            modified: true,
        });
    }

    handleShowRender = () => {
        this.setState({showRender: !this.state.showRender});
    }

    handleClose = () => {
        this.props.closeFile(this.props.fileObj);
    }

    render() {
        return (
            <div className="fill-parent" style={style.container}>
                <EditorGroupBar
                    renderVisible={this.state.showRender}
                    handleShowRender={this.handleShowRender}
                    handleClose={this.handleClose}
                    filename={this.props.fileObj.name}
                />
                <SplitPane style={style.fill}>
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