import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const InfoPane = (/*{ children }*/) => {
    // const [themeName, setThemeName] = useState("dark");
    const { /*themeName,*/ changeTheme } = useContext(ThemeContext);

    const style = {
        container: {
            display: "flex",
            flexFlow: "column nowrap",
            height: "100%",
        },
        button: {
            margin: "5%",
            display: "block",
            padding: "10px",
        },
    }

    const handleThemeChange = (event) => {
        let newTheme = event.target.value;
        changeTheme(newTheme);
    }
  
    return (
        <div style={style.container}>
            <button onClick={handleThemeChange} value="light" style={style.button}>Light Theme</button>
            <button onClick={handleThemeChange} value="dark" style={style.button}>Dark Theme</button>
        </div>
    );
};

export default InfoPane