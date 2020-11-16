import React, { useState, useEffect } from 'react';
import UserPreferences from './settings/UserPreferences';

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
    const [themeName, setThemeName] = useState(UserPreferences.get('theme'));
    const [theme, setTheme] = useState(themes[themeName]);

    // works only the first time to remove the default black titlebar
    titlebar.updateBackground(Color.fromHex(themes[themeName].backgroundAccent));
  
    const changeTheme = (newTheme) => {
        if (themes[newTheme]) {
            setTheme(themes[newTheme]);
            setThemeName(newTheme);
            titlebar.updateBackground(Color.fromHex(themes[newTheme].backgroundAccent));
            UserPreferences.set('theme', newTheme);
        }
    };

    useEffect(() => { // similar to componentDidMount and componentDidUpdate
        setCSSVariables(theme);
    }, [theme])
  
    return (
        <ThemeContext.Provider value={{ themeName, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContextWrapper;