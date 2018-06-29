import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let window: BrowserWindow;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

const createWindow = function () {
  window = new BrowserWindow({
    width : 700,
    height: 500
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    window.loadURL('http://localhost:4200');
    window.webContents.openDevTools();
  } else {
    const pathname = path.join(__dirname, 'dist/today-ng/index.html');

    window.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/today-ng/index.html'),
      protocol: 'files',
      slashes : true
    }));
    window.webContents.openDevTools(); // TODO comment this for release
  }

  window.on('closed', () => {
    window = null;
  });
};

app.on('ready', _ => createWindow());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
  if (!window) { createWindow(); }
});
