// renderer.js also
import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import Main from "./application/Main";
import { ThemeContextWrapper } from "./application/ThemeContext";
import { StorageContextWrapper } from "./application/storage/StorageContext";

const isElectron = window.isElectron;
const customTitlebar = isElectron && window.require("custom-electron-titlebar");
const titlebar =
    isElectron &&
    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex("#444"),
    });

ReactDOM.render(
    <React.StrictMode>
        <div style={{ height: "100%" }}>
            <StorageContextWrapper>
                <ThemeContextWrapper titlebar={titlebar}>
                    <Main />
                    <ToastContainer position="bottom-right" />
                </ThemeContextWrapper>
            </StorageContextWrapper>
        </div>
    </React.StrictMode>,
    document.getElementById("root")
);
