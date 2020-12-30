import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";

import Textbox from "./Textbox";

const style = {
    container: {
        position: "relative",
    },
    textbox: {
        background: "var(--backgroundColor)",
        textAlign: "center",
        cursor: "pointer",
    },
    picker: {
        position: "fixed",
        // left: "-15%",
        zIndex: "8",
    },
};

const DatePicker = (props) => {
    let [visible, setVisible] = useState(false);
    const calRef = useRef(null);

    useEffect(() => {
        // add when mounted
        const handleClick = (event) => {
            if (
                !calRef.current || // textbox is undefined
                calRef.current.contains(event.target)
            ) {
                return;
            }
            setVisible(false);
        };

        document.addEventListener("mousedown", handleClick);
        return () => {
            // return function to be called when unmounted
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <div style={style.container}>
            <div onClick={() => setVisible((prev) => !props.disabled && !prev)}>
                <Textbox
                    style={
                        props.disabled
                            ? { color: "var(--dividerColor)", ...style.textbox }
                            : style.textbox
                    }
                    initialValue={props.value.toDateString()}
                    disabled={true}
                />
            </div>
            {visible && (
                <div style={style.picker} ref={calRef}>
                    <Calendar {...props} />
                </div>
            )}
        </div>
    );
};

export default DatePicker;
