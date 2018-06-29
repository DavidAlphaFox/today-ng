"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var window;
var args = process.argv.slice(1);
var serve = args.some(function (val) { return val === '--serve'; });
var createWindow = function () {
    window = new electron_1.BrowserWindow({
        width: 700,
        height: 500
    });
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        window.loadURL('http://localhost:4200');
        window.webContents.openDevTools();
    }
    else {
        window.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/today-ng/index.html'),
            protocol: 'files',
            slashes: true
        }));
        window.webContents.openDevTools(); // TODO comment this for release
    }
    window.on('closed', function () {
        window = null;
    });
};
electron_1.app.on('ready', function (_) { return createWindow(); });
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if (!window) {
        createWindow();
    }
});
