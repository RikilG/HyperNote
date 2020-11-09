// renderer.js also
import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import Main from './application/Main';
import ThemeContextWrapper from './application/ThemeContext';

const customTitlebar = window.require('custom-electron-titlebar');
 
const titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#444')
});

ReactDOM.render(
    <React.StrictMode>
        <div style={{height: "100%"}}>
            <ThemeContextWrapper titlebar={titlebar}>
                <Main />
                <ToastContainer position="bottom-right" />
            </ThemeContextWrapper>
        </div>
    </React.StrictMode>,
    document.getElementById('root')
);