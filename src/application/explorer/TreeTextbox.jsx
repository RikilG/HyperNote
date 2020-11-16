import React, { useState, useRef, useEffect } from 'react';

import FileSystem from './FileSystem';
import Textbox from '../ui/Textbox';

const style = {
    container: {
        margin: "0 5px 0 22px",
        display: "flex",
        flexFlow: "row nowrap",
    },
}

const TreeTextbox = (props) => { // clickEvent, textbox, setTextbox, path
    let [name, setName] = useState("");
    const path = props.path;
    const textboxRef = useRef(null);

    const handleClick = (event) => {
        if (textboxRef.current.contains(event.target)) {
            return;
        }
        props.setTextbox(false);
        if (name !== "") {
            if (props.clickEvent === 'file')
                FileSystem.newFile(FileSystem.join(path, name));
            else
                FileSystem.newDirectory(FileSystem.join(path, name));
        }
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });

    const handleChange = (event) => {
        event.stopPropagation();
        setName(event.target.value);
        if (props.clickEvent === 'file' && event.target.value.includes(".")) {
            let filename = event.target.value;
            let splitstring = filename.split(".");
            let substring = splitstring[splitstring.length - 1];
            switch (substring) {
                case 'txt': case 'md': case 'rtf':
                case 'tex': case 'csv': case 'svg':
                case 'rst': case 'rss': case 'xml':
                case 'ini': case 'json': case 'yml':
                case 'asciidoc':
                    props.setTextbox(false);
                    FileSystem.newFile(FileSystem.join(path, filename));
                    break;
                default:
            }
        }
    }

    const keyPress = (event) => {
        if (event.key === 'Enter') {
            props.setTextbox(false);
            if (props.clickEvent === 'file')
                FileSystem.newFile(FileSystem.join(path, name));
            else
                FileSystem.newDirectory(FileSystem.join(path, name));
        }
        else if (event.key === 'Escape') {
            props.setTextbox(false);
            setName("");
        }
    }

    return (
        <div ref={textboxRef} style={style.container}>
            {props.textbox && //Require: Bugfix to follow file naming conventions
                <Textbox onChange={handleChange} onKeyDown={keyPress} placeholder={props.clickEvent === 'file' ? 'file name' : 'folder name'} />
            }
        </div>
    );
};

export default TreeTextbox;