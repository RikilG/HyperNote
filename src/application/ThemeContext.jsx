import React, { useState, useEffect } from 'react';

import themes from './css/themes';

const setCSSVariables = (theme) => {
    for (const value in theme) {
        document.documentElement.style.setProperty(`--${value}`, theme[value]);
    }
};  

export const ThemeContext = React.createContext({
    themeName: "dark",
    changeTheme: () => {}
});

const ThemeContextWrapper = ({ children }) => {
    const [themeName, setThemeName] = useState("dark");
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
            setThemeName(newTheme)
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