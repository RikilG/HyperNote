import { useContext, useEffect, useRef, useState } from "react";

import StorageContext from "../storage/StorageContext";

const style = {
    container: {
        display: "flex",
        flexFlow: "row nowrap",
        alignContent: "center",
        justifyContent: "center",
    },
    timeBox: {
        background: "var(--backgroundColor)",
        padding: "0.2rem",
        margin: "0 0.2rem",
        width: "35px",
        textAlign: "center",
        color: "var(--primaryTextColor)",
        border: "none",
        borderRadius: "0.3rem",
    },
};

const convertTo12H = (hrs) => {
    if (hrs === 0 || hrs === 12) {
        return { hrs: 12, type: hrs === 0 ? "am" : "pm" };
    } else if (hrs < 12) {
        return { hrs: hrs, type: "am" };
    } else {
        return { hrs: hrs - 12, type: "pm" };
    }
};

const TimePicker = ({ initialValue, setTime }) => {
    const { userPreferences } = useContext(StorageContext);
    const now = initialValue || new Date();
    let [minVal, setMinVal] = useState(now.getMinutes());
    let [hrsVal, setHrsVal] = useState(now.getHours());
    let typeRef = useRef(null);

    // const handleLimits = (val, min, max, setter) => {
    //     val = parseInt(val);
    //     if (!val) setMinVal(0);
    //     if (val < min || val >= max) {
    //         console.log(val, typeof val);
    //         setter(Math.min(Math.max(min, val), max));
    //     }
    // };

    useEffect(() => {
        if (userPreferences.get("preferredTimeFormat") === "12H") {
            setHrsVal((prev) => {
                const converted = convertTo12H(prev);
                typeRef.current.value = converted.type;
                return converted.hrs;
            });
        } else {
            typeRef.current.value = "hrs";
        }
    }, []);

    return (
        <div style={style.container}>
            <input
                type="number"
                min={typeRef.current && typeRef.current.value === "hrs" ? 0 : 1}
                max={
                    typeRef.current && typeRef.current.value === "hrs" ? 23 : 12
                }
                style={style.timeBox}
                placeholder="HH"
                value={hrsVal}
                onChange={(e) =>
                    setHrsVal((prev) => {
                        const val = e.target.value;
                        if (setTime)
                            setTime({
                                hrs: val,
                                mins: minVal,
                                fmt: typeRef.current.value,
                            });
                        return val;
                    })
                }
            />
            <div>:</div>
            <input
                type="number"
                min={0}
                max={59}
                style={style.timeBox}
                placeholder="MM"
                value={minVal}
                onChange={(e) =>
                    setMinVal((prev) => {
                        const val = e.target.value;
                        if (setTime)
                            setTime({
                                hrs: hrsVal,
                                mins: val,
                                fmt: typeRef.current.value,
                            });
                        return val;
                    })
                }
            />
            <select ref={typeRef}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
                <option value="hrs">24-Hour</option>
            </select>
        </div>
    );
};

export default TimePicker;
