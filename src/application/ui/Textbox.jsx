// used in Searchbar.jsx

import { useState, useRef, useEffect } from "react";

const style = {
    container: {
        margin: "1px 5px",
        display: "flex",
        flexFlow: "row nowrap",
        flex: "1",
    },
};

/*
Passable props:
- initialValue
- visible
- setVisible
- style
- containerStyle
- disabled
- type
- placeholder
- handleCancel
- handleConfirm
- handleChange
- handleKeyPress
*/

const Textbox = (props) => {
    let [name, setName] = useState(props.initialValue || "");
    const textboxRef = useRef(null);

    const setVisible = (value) => {
        if (props.setVisible) {
            props.setVisible(value);
        }
    }

    const handleCancel = (type) => {
        if (props.handleCancel) {
            let newName = props.handleCancel(name, type);
            if ((newName || newName === "") && typeof newName === "string") setName(newName);
        }
    }

    const handleConfirm = () => {
        if (props.handleConfirm) {
            let newName = props.handleConfirm(name);
            if ((newName || newName === "") && typeof newName === "string") setName(newName);
        }
    }

    const handleClick = (event) => {
        if (textboxRef.current.contains(event.target)) {
            // click inside textbox
            return;
        }
        setVisible(false);
        if (name !== "") {
            handleCancel('click');
        }
    }

    const handleChange = (event) => {
        event.stopPropagation();
        setName(event.target.value);
        if (props.handleChange) props.handleChange(event.target.value);
    }

    const keyPress = (event) => {
        if (event.key === 'Enter') {
            setVisible(false);
            handleConfirm();
        }
        else if (event.key === 'Escape') {
            setVisible(false);
            handleCancel('key');
        }
    }

    useEffect(() => { // add when mounted
        document.addEventListener("mousedown", handleClick);
        return () => { // return function to be called when unmounted
            document.removeEventListener("mousedown", handleClick);
        };
    }, [handleClick]);

    useEffect(() => { // run on componentDidMount!
        setName(props.initialValue);
    }, [props.initialValue])

    return (
        <div ref={textboxRef} style={props.containerStyle || style.container}>
            {(props.visible === undefined ? true : props.visible) && 
                <input
                    value={name || ""}
                    style={props.style}
                    type={"text" || props.type}
                    className="textbox"
                    onChange={handleChange}
                    onKeyDown={props.handleKeyPress || keyPress}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                />
            }
        </div>
    );
}

export default Textbox;