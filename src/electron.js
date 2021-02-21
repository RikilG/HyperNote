const path = require("path");
const { app, BrowserWindow, protocol } = require("electron");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        title: "Hypernote",
        backgroundColor: "#202020",
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
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
}

app.on("ready", () => {
    // register a custom protol similar to file:// to get local
    // media like audio and images
    protocol.registerFileProtocol("hypernote", (request, callback) => {
        const url = request.url.substr(12); // all urls start with 'file://'
        callback({ path: path.normalize(`${__dirname}/${url}`) });
    });
    createWindow();
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// const startUrl = process.env.ELECTRON_START_URL || url.format({
//     pathname: path.join(__dirname, '/../build/index.html'),
//     protocol: 'file:',
//     slashes: true
// });
// mainWindow.loadURL(startUrl);
