import React, { useContext } from "react";
import { toast } from "react-toastify";
import { ThemeContext } from "../ThemeContext";
import themes from "../themes/themes";

const style = {
    container: {
        fontSize: "1.2rem",
    },
    header: {
        fontSize: "1.7rem",
        padding: "0.4rem 0",
    },
    subheader: {
        fontSize: "1.5rem",
        padding: "0.3rem 0",
    },
    button: {
        margin: "2% 5%",
        padding: "10px",
        background: "var(--primaryColor)",
    },
};

const Appearance = () => {
    const { themeName, changeTheme } = useContext(ThemeContext);

    const handleThemeChange = (event) => {
        let newTheme = event.target.value;
        changeTheme(newTheme);
        toast("Applied theme: " + newTheme);
    };

    return (
        <div style={style.container}>
            <div style={style.header}>Appearance</div>
            <div style={style.subheader}>Theme</div>
            <select onChange={handleThemeChange} value={themeName}>
                {Object.keys(themes).map((theme) => (
                    <option value={theme} key={theme}>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Appearance;
