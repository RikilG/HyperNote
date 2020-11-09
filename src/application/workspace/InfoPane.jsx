import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ThemeContext } from '../ThemeContext';
import themes from '../css/themes';

import Dialog from '../ui/Dialog';
import Button from '../ui/Button';

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

const InfoPane = (/*{ children }*/) => {
    const [dialog, setDialog] = useState({
        visible: false,
        onAccept: () => {},
        onReject: () => {},
        onCancel: () => {},
    });
    const { /*themeName,*/ changeTheme } = useContext(ThemeContext);

    const showDialog = (onAccept, onReject, onCancel) => {
        setDialog({
            visible: true,
            onAccept: onAccept,
            onReject: onReject,
            onCancel: onCancel,
        });
    }

    const hideDialog = () => {
        setDialog({ visible: false });
    }

    const handleThemeChange = (event) => {
        let newTheme = event.target.getAttribute('value');
        
        showDialog(
            () => {changeTheme(newTheme); hideDialog(); toast("Applied theme: "+newTheme)},
            hideDialog,
            hideDialog,
        );
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
            {getThemeButtons()}
            <Dialog config={dialog}>Are you sure?</Dialog>
        </div>
    );
};

export default InfoPane