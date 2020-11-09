import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { ThemeContext } from '../ThemeContext';
import themes from '../css/themes';

import Button from '../ui/Button';

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
}

const Appearance = (props) => {
    const { /*themeName,*/ changeTheme } = useContext(ThemeContext);

    const handleThemeChange = (event) => {
        let newTheme = event.target.getAttribute('value');
        changeTheme(newTheme);
        toast("Applied theme: " + newTheme);
    }

    const getThemeButtons = () => {
        let output = [];
        for (var theme in themes) {
            output.push(<Button key={theme} onClick={handleThemeChange} value={theme} style={style.button}>{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</Button>)
        }
        return output;
    }

    return (
        <div style={style.container}>
            <div style={style.header}>Appearance</div>
            <div style={style.subheader}>Theme</div>
            {getThemeButtons()}
        </div>
    );
}

export default Appearance;