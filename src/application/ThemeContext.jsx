import React, { useState, useEffect } from "react";
import UserPreferences from "./settings/UserPreferences";

import themes from "./themes/themes";
const { Color } = window.require("custom-electron-titlebar");

const setCSSAttribute = (attribute, value) => {
    document.documentElement.style.setProperty(`--${attribute}`, value);
};

const getCSSAttribute = (attribute) => {
    return document.documentElement.style.getPropertyValue(`--${attribute}`);
};

const setCSSVariables = (theme) => {
    for (const value in theme) {
        setCSSAttribute(value, theme[value]);
    }
    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    setCSSAttribute("windowWidth", `${docWidth}px`);
    setCSSAttribute("windowHeight", `${docHeight}px`);
};

export const ThemeContext = React.createContext({
    theme: {},
    themeName: "dark",
    changeTheme: () => {},
    getCSSAttribute: () => {},
    setCSSAttribute: () => {},
});

const ThemeContextWrapper = ({ children, titlebar }) => {
    const [themeName, setThemeName] = useState(UserPreferences.get("theme"));
    const [theme, setTheme] = useState(themes[themeName]);

    const changeTheme = (newTheme) => {
        if (themes[newTheme]) {
            setTheme(themes[newTheme]);
            setThemeName(newTheme);
            titlebar.updateBackground(
                Color.fromHex(themes[newTheme].backgroundAccent)
            );
            UserPreferences.set("theme", newTheme);
        }
    };

    useEffect(() => {
        // similar to componentDidMount and componentDidUpdate
        // works only the first time to remove the default black titlebar
        titlebar.updateBackground(Color.fromHex(theme.windowFrame));
        setCSSVariables(theme);
    }, [theme, titlebar]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeName,
                changeTheme,
                getCSSAttribute,
                setCSSAttribute,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextWrapper;
