const getincomegrabber = require("../grabber/getincomegrabber.js");
const peerberrygrabber = require("../grabber/peerberrygrabber.js");
const bondstergrabber = require("../grabber/bondstergrabber.js");
const estategurugrabber = require("../grabber/estategurugrabber.js");
const lendsecuredgrabber = require("../grabber/lendsecuredgrabber.js");
const lendermarketgrabber = require("../grabber/lendermarketgrabber.js");
const esketitgrabber = require("../grabber/esketitgrabber.js");
const store = require("electron-json-storage");
var Mutex = require('async-mutex').Mutex;
const mutex = new Mutex();

const queryAccount = async (arg) => {
    let lastUpdated = 0;
    let accounts = store.getSync("accounts");
    if (!accounts || !Array.isArray(accounts)) {
      accounts = [];
    }
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].id === arg.id) {
        let balance = {};
        switch (accounts[i].type) {
          case "GetIncome":
            balance = await getincomegrabber.grabGetIncome(accounts[i].user, accounts[i].password);
            lastUpdated = await updateAccountBalances(arg.id, balance);
            break;
          case "PeerBerry":
            balance = await peerberrygrabber.getPeerBerry(accounts[i].user, accounts[i].password);
            lastUpdated = await updateAccountBalances(arg.id, balance);
            break;
          case "Bondster":
            balance = await bondstergrabber.getBondster(accounts[i].user, accounts[i].password);
            lastUpdated =await updateAccountBalances(arg.id, balance);
            break;
          case "EstateGuru":
            balance = await estategurugrabber.getEstateGuru(accounts[i].user, accounts[i].password);
            lastUpdated = await updateAccountBalances(arg.id, balance);
            break;
          case "LendSecured":
            balance = await lendsecuredgrabber.getLendSecured(accounts[i].user, accounts[i].password);
            lastUpdated = await updateAccountBalances(arg.id, balance);
            break;
          case "Lendermarket":
            balance = await lendermarketgrabber.grabLendermarket(accounts[i].user, accounts[i].password);
            lastUpdated = await updateAccountBalances(arg.id, balance);
            break;
          case "Esketit":
            balance = await esketitgrabber.grabEsketit(accounts[i].user, accounts[i].password);
            lastUpdated = await updateAccountBalances(arg.id, balance);
            break;
          default:
            throw "Unknown provider";
        }
        return {id : arg.id, data: balance, lastUpdated};
      }
    }
    return null;
};

const addAccount = (event, arg) => {
  let accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  accounts.push(arg);

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
};

const listAccounts = (event, arg) => {
  let accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  for (let i = 0; i < accounts.length; i++) {
    accounts[i].balances = store.getSync("balance_" + accounts[i].id);
  }
  event.reply("list-accounts-reply", accounts);
};

const deleteAccount = (event, arg) => {
  let accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg) {
      accounts.splice(i, 1);
      break;
    }
  }

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
};

const updateAccount = (event, arg) => {
  const today = new Date();
  let accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg.id) {
      accounts[i].name = arg.name;
      accounts[i].user = arg.user;
      accounts[i].password = arg.password;
      accounts[i].description = arg.description;
      accounts[i].lastUpdated = today.getTime() - today.getTimezoneOffset() * 60000;
      break;
    }
  }

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
};

const  updateAccountBalances= async (id, balanceData) => {
  const today = new Date();
  let accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === id) {
      accounts[i].lastUpdated = today.getTime() - today.getTimezoneOffset() * 60000;
      break;
    }
  }
  store.set("accounts", accounts);

  let balances = store.getSync("balance_" + id);
  if (!balances) {
    balances = {};
  }
  const dateString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  balances[dateString] = balanceData;
  store.set("balance_" + id, balances);

  return today.getTime() - today.getTimezoneOffset() * 60000;
}

exports.addAccount = addAccount;
exports.listAccounts = listAccounts;
exports.deleteAccount = deleteAccount;
exports.updateAccount = updateAccount;
exports.queryAccount = queryAccount;
