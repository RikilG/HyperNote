// const Textarea = (props) => {
//     return (
//         <textarea {...props} />
//     );
// }

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
- value
- visible
- setVisible
- style
- disabled
- placeholder
- handleCancel
- handleChange
- className
*/

const Textarea = (props) => {
    const { setVisible, handleCancel } = props;
    let [ name, setName ] = useState(props.value || props.initialValue || "");
    const textboxRef = useRef(null);

    const handleCancelWrapper = useCallback(() => {
        if (handleCancel) {
            setName((prevName) => {
                let newName = handleCancel(prevName);
                if ((newName || newName === "") && typeof newName === "string") 
                    return newName;
                return prevName
            });
        }
    }, [handleCancel]);

    const handleChange = (event) => {
        event.stopPropagation();
        setName(event.target.value);
        if (props.handleChange) props.handleChange(event.target.value);
    }

    useEffect(() => { // add when mounted
        const handleClick = (event) => {
            if (textboxRef.current.contains(event.target)) {
                // click inside textbox
                return;
            }
            if (setVisible) setVisible(false);
            handleCancelWrapper('click');
        }

        document.addEventListener("mousedown", handleClick);
        return () => { // return function to be called when unmounted
            document.removeEventListener("mousedown", handleClick);
        };
    }, [handleCancelWrapper, setVisible]);

    useEffect(() => { // run on componentDidMount!
        setName(props.initialValue);
    }, [props.initialValue])

    return (
        <>
            {(props.visible === undefined ? true : props.visible) && 
                <textarea
                    ref={textboxRef}
                    value={props.value || name || ""}
                    style={props.style || style.container}
                    className={props.className}
                    onChange={handleChange}
                    placeholder={props.placeholder}
                    disabled={props.disabled}
                />
            }
        </>
    );
}

export default Textarea;