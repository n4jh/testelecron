const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require('electron-updater');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    })
}

app.on('ready', () => {
    createWindow();
});


app.on('window-all-closed', ()=> {
    if( process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', ()=> {
    if(mainWindow == null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-availavle', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on("restart_app", () => {
    autoUpdater.quitAndInstall();
});