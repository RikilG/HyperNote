import React, { useEffect, useState } from 'react';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { toast } from 'react-toastify';

import '../css/Editor.css'
import Textarea from '../ui/Textarea';
import Renderer from './Renderer';
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
    let [value, setValue] = useState('# Loading...');
    let [modified, setModified] = useState(false);
    let [currentChoice, setCurrentChoice] = useState(0);

    useEffect(() => {
        if (props.fileObj) {
            setValue(FileSystem.readFile(props.fileObj.path));
        }
    }, [props.fileObj]) // runs ony once, componentDidMount or when props change

    const handleTextChange = (text) => {
        setValue(text);
        setModified(true);
    }

    const handleEditorGroup = () => {
        let choice = (currentChoice + 1) % 3;
        setCurrentChoice(choice);
    }

    const handleSave = () => {
        if (!modified) {
            return;
        }
        else {
            toast("File save functionality not yet done :)");
        }
    }

    return (
        <div className="fill-parent" style={style.container}>
            <EditorGroupBar
                choice={currentChoice}
                handleEditorGroup={handleEditorGroup}
                fileObj={props.fileObj}
                handleSave={handleSave}
            />
            <SplitPane style={style.fill}>
                {(currentChoice === 0 || currentChoice === 2) &&
                    <Pane minSize="50px">
                        <Textarea value={value} className="editor" handleChange={handleTextChange} />
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