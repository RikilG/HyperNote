import React, { useContext, useEffect, useState } from "react";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";
import { toast } from "react-toastify";

import "../css/Editor.css";
import Textarea from "../ui/Textarea";
import Renderer from "./Renderer";
import EditorGroupBar from "./EditorGroupBar";
import StorageContext from "../storage/StorageContext";

const style = {
    container: {
        display: "flex",
        flexFlow: "column",
    },
    fill: {
        flex: "1",
    },
};

const EditorGroup = (props) => {
    const { fileSystem } = useContext(StorageContext);
    let [value, setValue] = useState("# Loading...");
    let [modified, setModified] = useState(false);
    let [currentChoice, setCurrentChoice] = useState(0);

    useEffect(() => {
        if (props.fileObj) {
            fileSystem
                .readFile(props.fileObj.path)
                .then((data) => setValue(data));
        }
    }, [props.fileObj, fileSystem]); // runs ony once, componentDidMount or when props change

    const handleTextChange = (text) => {
        setValue(text);
        setModified(true);
    };

    const handleEditorGroup = () => {
        let choice = (currentChoice + 1) % 3;
        setCurrentChoice(choice);
    };

    const handleSave = () => {
        if (!modified) {
            return;
        } else {
            fileSystem.writeFile(props.fileObj.path, value).then((data) => {
                if (data && data.status !== 200) {
                    toast.error("ERROR WHILE SAVING FILE TO DROPBOX");
                } else toast("File saved successfully!");
            });
        }
    };

    return (
        <div className="fill-parent" style={style.container}>
            <EditorGroupBar
                choice={currentChoice}
                handleEditorGroup={handleEditorGroup}
                fileObj={props.fileObj}
                handleSave={handleSave}
            />
            <SplitPane style={style.fill}>
                {(currentChoice === 0 || currentChoice === 2) && (
                    <Pane minSize="50px">
                        <Textarea
                            value={value}
                            className="editor"
                            handleChange={handleTextChange}
                        />
                    </Pane>
                )}
                {(currentChoice === 1 || currentChoice === 2) && (
                    <Pane minSize="50px">
                        <Renderer value={value} />
                    </Pane>
                )}
            </SplitPane>
        </div>
    );
};

export default EditorGroup;
