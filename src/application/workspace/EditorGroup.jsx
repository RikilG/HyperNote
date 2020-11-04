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
            showEditor: true,
            currentChoice: 0,
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

    /*handleShowRender = () => {
        this.setState({ showRender: !this.state.showRender });
    }

    handleShowEditor = () => {
        this.setState({ showEditor: !this.state.showEditor });
    }*/

    handleEditorGroup = () => {
        let choice = (this.state.currentChoice + 1) % 3;
        if (choice === 0) {
            this.setState({ showEditor: true, showRender: false });
        }
        else if (choice === 1) {
            this.setState({ showEditor: false, showRender: true });
        }
        else {
            this.setState({ showEditor: true, showRender: true });
        }
        this.setState({ currentChoice: choice });
    }

    handleClose = () => {
        this.props.closeFile(this.props.fileObj);
    }

    render() {
        return (
            <div className="fill-parent" style={style.container}>
                <EditorGroupBar
                    choice={this.state.currentChoice}
                    handleEditorGroup={this.handleEditorGroup}
                    handleClose={this.handleClose}
                    filename={this.props.fileObj.name}
                />
                <SplitPane style={style.fill}>
                    {this.state.showEditor &&
                        <Pane minSize="50px">
                            <Editor value={this.state.value} handleChange={this.handleTextChange} />
                        </Pane>
                    }
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