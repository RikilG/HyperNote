const path = require("path");
const { app, BrowserWindow, protocol } = require("electron");

let mainWindow;
let authWindow;

function createAuthWindow(authUrl) {
    authWindow = new BrowserWindow({
        width: 600,
        height: 800,
        show: false,
        parent: mainWindow,
        modal: true,
        "node-integration": false,
        "web-security": false,
    });

    authWindow.loadURL(authUrl);
    authWindow.on("ready-to-show", function () {
        authWindow.show();
        authWindow.focus();
    });
    // 'will-navigate' is an event emitted when the window.location changes
    // newUrl should contain the tokens you need
    // 'will-redirect' used here as will-navigate was not working for dropbox
    authWindow.webContents.on("will-redirect", function (event, newUrl) {
        // More complex code to handle tokens goes here
        if (newUrl.startsWith("http://localhost")) {
            mainWindow.loadURL(newUrl);
            authWindow.hide();
            authWindow.close();
            mainWindow.webContents.send("parse-args-invoke", newUrl);
        }
    });

    authWindow.on("closed", function () {
        authWindow = null;
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "Hypernote",
        backgroundColor: "#202020",
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true, // for accessing userData
            preload: path.join(__dirname, "preload.js"),
        },
        frame: false,
    });

    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", function () {
        mainWindow = null;
    });

    mainWindow.on("ready-to-show", function () {
        mainWindow.show();
        mainWindow.focus();
    });

    mainWindow.webContents.on("will-navigate", function (event, newUrl) {
        // More complex code to handle tokens goes here
        event.preventDefault();
        createAuthWindow(newUrl);
    });
}

app.on("ready", () => {
    // register a custom protol similar to file:// to get local
    // media like audio and images
    protocol.registerFileProtocol("hypernote", (request, callback) => {
        const url = request.url.substr(12); // all urls start with 'file://'
        callback({ path: path.normalize(`${path.dirname(__dirname)}/${url}`) });
    });
    createMainWindow();
});

const requestHandler = require("./requestHandler");

app.on("window-all-closed", function () {
    requestHandler.close();
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createMainWindow();
    }
});

// const startUrl = process.env.ELECTRON_START_URL || url.format({
//     pathname: path.join(__dirname, '/../build/index.html'),
//     protocol: 'file:',
//     slashes: true
// });
// mainWindow.loadURL(startUrl);
