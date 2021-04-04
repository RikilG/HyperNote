import React, { useState, useEffect, useContext } from "react";
import StorageContext from "./storage/StorageContext";
import themes from "./themes/themes";

const isElectron = window.isElectron;
const Color = isElectron && window.require("custom-electron-titlebar").Color;

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

export const ThemeContextWrapper = ({ children, titlebar }) => {
    const { userPreferences } = useContext(StorageContext);
    const [themeName, setThemeName] = useState(userPreferences.get("theme"));
    const [theme, setTheme] = useState(themes[themeName]);

    const changeTheme = (newTheme) => {
        if (themes[newTheme]) {
            setTheme(themes[newTheme]);
            setThemeName(newTheme);
            if (isElectron) {
                titlebar.updateBackground(
                    Color.fromHex(themes[newTheme].backgroundAccent)
                );
            }
            userPreferences.set("theme", newTheme);
        }
    };

    useEffect(() => {
        // similar to componentDidMount and componentDidUpdate
        // works only the first time to remove the default black titlebar
        if (isElectron) {
            titlebar.updateBackground(Color.fromHex(theme.windowFrame));
        }
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
