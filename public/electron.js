// Module to control the application lifecycle and the native browser window.
const {app, BrowserWindow, protocol, Notification} = require('electron');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');
const store = require('electron-json-storage');
const fetch = require('node-fetch');
const accountHandler = require('./js/handlers/accounthandler.js');

ipcMain.on('query-account', (event, arg) => {
  accountHandler.queryAccounts(event, arg);
});

ipcMain.on('add-account', (event, arg) => {
  accountHandler.addAccount(event, arg);
});

ipcMain.on('list-accounts', (event, arg) => {
  accountHandler.listAccounts(event, arg);
});

ipcMain.on('delete-account', (event, arg) => {
  accountHandler.deleteAccount(event, arg);
});

ipcMain.on('update-account', (event, arg) => {
  accountHandler.updateAccount(event, arg);
});

ipcMain.on('get-version', (event, arg) => {
  event.reply('query-version', app.getVersion());
});

ipcMain.on('update-app', (event, arg) => {
  let updateConfig = store.getSync('update_config');
  if (!updateConfig || !updateConfig.lastCheck) {
    updateConfig = {lastCheck: 0};
  }
  const hour = 60 * 60 * 1000;
  if (new Date() - new Date(updateConfig.lastCheck) > hour) {
    updateConfig.lastCheck = new Date();
    store.set('update_config', updateConfig);
    checkForUpdate(event);
  }
});

async function checkForUpdate(event) {
  const api = 'https://api.github.com/repos/exAphex/p2pmanager/releases';
  const response = await fetch(api, {method: 'GET'});
  const json = await response.json();
  if (json && json.length > 0) {
    json.sort(function(l, u) {
      return new Date(l.published_at) < new Date(u.published_at) ? 1 : -1;
    });
    if (json[0].name != app.getVersion()) {
      const notification = new Notification({title: 'New Version available', body: 'A new release was found: ' + json[0].name + '. Click to download update!'});
      notification.show();

      notification.on('click', (event, arg) => {
        const url = 'https://github.com/exAphex/p2pmanager/releases/';
        require('electron').shell.openExternal(url);
      });
    }
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const appURL = app.isPackaged ?
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }) :
    'http://localhost:3000';
  mainWindow.loadURL(appURL);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
      'file',
      (request, callback) => {
        const url = request.url.substr(8);
        callback({path: path.normalize(`${__dirname}/${url}`)});
      },
      (error) => {
        if (error) console.error('Failed to register protocol');
      },
  );
}

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const allowedNavigationDestinations = 'https://my-electron-app.com';
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});
