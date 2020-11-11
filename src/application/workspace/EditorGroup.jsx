import React, { useContext, useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';

import WindowContext from '../WindowContext';
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

const EditorGroup = (props) => {
    const { closeWindow } = useContext(WindowContext);
    let [value, setValue] = useState('# Loading...');
    let [modified, setModified] = useState(false);
    let [currentChoice, setCurrentChoice] = useState(0);

    useEffect(() => {
        if (props.fileObj) {
            setValue(FileSystem.readFile(props.fileObj.path));
        }
    }, [props.fileObj]) // runs ony once, componentDidMount or when props change

    const handleTextChange = (event) => {
        setValue(event.target.value);
        setModified(true);
    }

    const handleEditorGroup = () => {
        let choice = (currentChoice + 1) % 3;
        setCurrentChoice(choice);
    }

    const handleClose = () => {
        closeWindow(props.fileObj);
    }

    return (
        <div className="fill-parent" style={style.container}>
            <EditorGroupBar
                choice={currentChoice}
                handleEditorGroup={handleEditorGroup}
                handleClose={handleClose}
                filename={props.fileObj.name}
            />
            <SplitPane style={style.fill}>
                {(currentChoice === 0 || currentChoice === 2) &&
                    <Pane minSize="50px">
                        <Editor value={value} handleChange={handleTextChange} />
                    </Pane>
                }
                {(currentChoice === 1 || currentChoice === 2) &&
                    <Pane minSize="50px">
                        <Renderer value={value} />
                    </Pane>
                }
            </SplitPane>
        </div>
    );
}

export default EditorGroup;