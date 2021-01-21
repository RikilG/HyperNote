// used in Checklist.jsx

//import { useState, useRef, useEffect, useCallback } from "react";
import Textbox from "./Textbox";

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
- initialText
- textboxStyle
- placeholder
- defaultChecked
- onCheckboxToggle
- handleCancel
- handleConfirm
- handleChange
- handleKeyPress
*/

const CheckBox = (props) => {
    return (
        <div style={props.containerStyle || style.container}>
            <input
                type="checkbox"
                className="checkbox"
                defaultChecked={props.defaultChecked}
                onChange={props.onCheckboxToggle}
            />
            <Textbox
                initialValue={props.initialText}
                style={props.textboxStyle}
                placeholder={props.placeholder}
                handleCancel={props.handleCancel}
                handleConfirm={props.handleConfirm}
                handleChange={props.handleChange}
                handleKeyPress={props.handleKeyPress}
            />
        </div>
    );
};

export default CheckBox;
