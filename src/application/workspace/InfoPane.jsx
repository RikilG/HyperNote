import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import themes from '../css/themes';

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
            margin: "2% 5%",
            display: "block",
            padding: "10px",
            background: "var(--primaryColor)",
        },
    }

    const handleThemeChange = (event) => {
        let newTheme = event.target.value;
        changeTheme(newTheme);
    }

    const getThemeButtons = () => {
        let output = [];

        for (var theme in themes) {
            output.push(<button key={theme} onClick={handleThemeChange} value={theme} style={style.button}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</button>)
        }

        return output;
    }
  
    return (
        <div style={style.container}>
            {getThemeButtons()}
        </div>
    );
};

export default InfoPane