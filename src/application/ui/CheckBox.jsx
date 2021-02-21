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
    textbox: {
        background: "var(--backgroundColor)",
    },
};

/*
Passable props:
- initialText
- textboxStyle
- placeholder
- defaultChecked
- onChange
- handleCancel
- handleConfirm
- handleChange
- handleKeyPress
- editable (default: false)
*/

const CheckBox = (props) => {
    return (
        <div style={props.containerStyle || style.container}>
            <input
                type="checkbox"
                className="checkbox"
                defaultChecked={props.defaultChecked}
                checked={props.value}
                onChange={props.onChange}
            />
            <Textbox
                initialValue={props.initialText}
                style={props.textboxStyle || style.textbox}
                placeholder={props.placeholder}
                handleCancel={props.handleCancel}
                handleConfirm={props.handleConfirm}
                handleChange={props.handleChange}
                handleKeyPress={props.handleKeyPress}
                disabled={!props.editable}
            />
        </div>
    );
};

export default CheckBox;
