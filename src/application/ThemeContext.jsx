import React, { useState, useEffect } from 'react';

import themes from './css/themes';
const { Color } = window.require('custom-electron-titlebar');

const setCSSVariables = (theme) => {
    for (const value in theme) {
        document.documentElement.style.setProperty(`--${value}`, theme[value]);
    }
};  

export const ThemeContext = React.createContext({
    themeName: "dark",
    changeTheme: () => {}
});

const ThemeContextWrapper = ({ children, titlebar }) => {
    const [themeName, setThemeName] = useState("material");
    const [theme, setTheme] = useState(themes[themeName]);
  
    const changeTheme = (newTheme) => {
        // if (theme === themes.dark) {
        //     setTheme(themes.light);
        //     setThemeName("light");
        // }
        // else {
        //     setTheme(themes.dark);
        //     setThemeName("dark");
        // }
        if (themes[newTheme]) {
            setTheme(themes[newTheme]);
            setThemeName(newTheme);
            titlebar.updateBackground(Color.fromHex(themes[newTheme].backgroundAccent));
        }
    };

    useEffect(() => { // similar to componentDidMount and componentDidUpdate
        setCSSVariables(theme);
    })
  
    return (
        <ThemeContext.Provider value={{ themeName, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextWrapper;