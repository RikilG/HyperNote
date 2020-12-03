// used in Searchbar.jsx

import { useState, useRef, useEffect, useCallback } from "react";

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
    const { setVisible, handleCancel, initialValue } = props;

    const handleCancelWrapper = useCallback(
        (type) => {
            if (handleCancel) {
                setName((prevName) => {
                    if (prevName === "") return initialValue || "";
                    let newName = handleCancel(prevName, type);
                    if (
                        (newName || newName === "") &&
                        typeof newName === "string"
                    )
                        return newName;
                    return prevName;
                });
                // let newName = handleCancel(name, type);
                // if ((newName || newName === "") && typeof newName === "string")
                //     setName(newName);
            }
        },
        [handleCancel, initialValue]
    );

    const handleConfirm = () => {
        if (props.handleConfirm) {
            let newName = props.handleConfirm(name);
            if (
                (newName || newName === "") &&
                typeof newName === "string"
            )
                setName(newName);
        }
    };

    const handleChange = (event) => {
        event.stopPropagation();
        setName(event.target.value);
        if (props.handleChange)
            props.handleChange(event.target.value);
    };

    const keyPress = (event) => {
        if (event.key === "Enter") {
            if (setVisible) setVisible(false);
            handleConfirm();
        } else if (event.key === "Escape") {
            if (setVisible) setVisible(false);
            handleCancelWrapper("key");
        }
    };

    useEffect(() => {
        // add when mounted
        const handleClick = (event) => {
            if (
                !textboxRef.current || // textbox is undefined
                textboxRef.current.contains(event.target)
            ) {
                // click inside textbox
                return;
            }
            if (setVisible) setVisible(false);
            handleCancelWrapper("click");
        };

        document.addEventListener("mousedown", handleClick);
        return () => {
            // return function to be called when unmounted
            document.removeEventListener("mousedown", handleClick);
        };
    }, [handleCancelWrapper, setVisible]);

    useEffect(() => {
        // run on componentDidMount!
        setName(props.initialValue);
    }, [props.initialValue]);

    return (
        <div
            ref={textboxRef}
            style={props.containerStyle || style.container}
        >
            {(props.visible === undefined ? true : props.visible) && (
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
            )}
        </div>
    );
};

export default Textbox;
