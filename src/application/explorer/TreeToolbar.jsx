import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import FileSystem from './FileSystem';
import UserPreferences from '../settings/UserPreferences';

const style = {
    menu: {
        display: "flex",
        flexFlow: "row",
        flex: "1",
        justifyContent: "space-evenly",
        borderColor: "var(--backgroundAccent)",
        marginBottom: '0.3rem',
        borderTop: "0",
        borderLeft: "0"
    },
    icon: {
        padding: '0.4rem',
        cursor: "pointer",
    }
}

const TreeToolbar = (props) => {
    let [textbox, setTextbox] = useState(false);
    let [name, setName] = useState("");
    let [clickEvent, setClickEvent] = useState("");
    let storageLocation = 'noteStorage';

    const node = useRef();

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
        let path = UserPreferences.get(storageLocation);
        setName(event.target.value);
        if (clickEvent === 'file' && event.target.value.includes(".")) {
            let filename = event.target.value;
            let splitstring = filename.split(".");
            let substring = splitstring[splitstring.length - 1];
            switch (substring) {
                case 'txt': case 'docx': case 'py':
                case 'pdf': case 'odt': case 'rtf':
                case 'tex': case 'wpd': case 'java':
                case 'pl': case 'class': case 'cpp':
                case 'sh': case 'swift': case 'vb':
                case 'php': case 'css': case 'html':
                case 'js': case 'jpeg': case 'png':
                case 'svg': case 'csv':
                    setTextbox(false);
                    FileSystem.newFile(path + '\\' + filename);
                default:
            }
        }
    }

    const keyPress = (event) => {
        let path = UserPreferences.get(storageLocation);
        if (event.key === 'Enter') {
            setTextbox(false);
            if (clickEvent === 'file')
                FileSystem.newFile(path + '\\' + name);
            else
                FileSystem.newDirectory(path + '\\' + name);
        }
    }

    const handleClick = e => {
        let path = UserPreferences.get(storageLocation);
        if (node.current.contains(e.target)) {
            return;
        }
        setTextbox(false);
        if (name !== "") {
            if (clickEvent === 'file')
                FileSystem.newFile(path + '\\' + name);
            else
                FileSystem.newDirectory(path + '\\' + name);
        }
    };

    return (
        <div>
            <div style={style.menu}>
                <FontAwesomeIcon style={style.icon} icon={faPlus} onClick={() => { setTextbox(true); setClickEvent('file'); }} />
                <FontAwesomeIcon style={style.icon} icon={faFolderPlus} onClick={() => { setTextbox(true); setClickEvent('folder'); }} />
            </div>
            <div ref={node}>
                {textbox && ( //Require: Bugfix to follow file naming conventions
                    <input
                        type="text"
                        onChange={handleChange}
                        onKeyDown={keyPress}
                    />
                )
                }
            </div>
        </div>
    );
};

export default TreeToolbar;