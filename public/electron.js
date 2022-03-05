// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const url = require("url");
const { ipcMain } = require("electron");
const store = require("electron-json-storage");
const getincomegrabber = require("./js/grabber/getincomegrabber.js");
const peerberrygrabber = require("./js/grabber/peerberrygrabber.js");
const bondstergrabber = require("./js/grabber/bondstergrabber.js");
const estategurugrabber = require("./js/grabber/estategurugrabber.js");
const lendsecuredgrabber = require("./js/grabber/lendsecuredgrabber.js");
const lendermarketgrabber = require("./js/grabber/lendermarketgrabber.js");
const esketitgrabber = require("./js/grabber/esketitgrabber.js");

ipcMain.on("query-account", (event, arg) => {
  try {
    var accounts = store.getSync("accounts");
    if (!accounts || !Array.isArray(accounts)) {
      accounts = [];
    }
    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].id == arg.id) {
        switch (accounts[i].type) {
          case "GetIncome":
            getincomegrabber
              .grabGetIncome(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "PeerBerry":
            peerberrygrabber
              .getPeerBerry(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "Bondster":
            bondstergrabber
              .getBondster(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "EstateGuru":
            estategurugrabber
              .getEstateGuru(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "LendSecured":
            lendsecuredgrabber
              .getLendSecured(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "Lendermarket":
            lendermarketgrabber
              .grabLendermarket(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "Esketit":
            esketitgrabber
              .grabEsketit(accounts[i].user, accounts[i].password)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          default:
            var retObj = { message: arg, error: "Unknown account type" };
            event.reply("query-account-error", retObj);
        }
        break;
      }
    }
  } catch (e) {
    event.reply("on-error", { messsage: accounts, error: e });
  }
});

ipcMain.on("add-account", (event, arg) => {
  var accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  accounts.push(arg);

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
});

ipcMain.on("list-accounts", (event, arg) => {
  var accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  for (var i = 0; i < accounts.length; i++) {
    accounts[i].balances = store.getSync("balance_" + accounts[i].id);
  }
  event.reply("list-accounts-reply", accounts);
});

ipcMain.on("delete-account", (event, arg) => {
  var accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].id == arg) {
      accounts.splice(i, 1);
      break;
    }
  }

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
});

ipcMain.on("update-account", (event, arg) => {
  var accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (var i = 0; i < accounts.length; i++) {
    if (accounts[i].id == arg.id) {
      accounts[i].name = arg.name;
      accounts[i].user = arg.user;
      accounts[i].password = arg.password;
      accounts[i].description = arg.description;
      break;
    }
  }

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
});

ipcMain.on("get-version", (event, arg) => {
  event.reply("query-version", app.getVersion());
});

function updateAccountBalances(id, balanceData) {
  var balances = store.getSync("balance_" + id);
  if (!balances) {
    balances = {};
  }
  var today = new Date();
  var dateString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  balances[dateString] = balanceData;
  store.set("balance_" + id, balances);
}

// Create the native browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to locdalhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
