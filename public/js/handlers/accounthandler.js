const getincomegrabber = require("../grabber/getincomegrabber.js");
const peerberrygrabber = require("../grabber/peerberrygrabber.js");
const bondstergrabber = require("../grabber/bondstergrabber.js");
const estategurugrabber = require("../grabber/estategurugrabber.js");
const lendsecuredgrabber = require("../grabber/lendsecuredgrabber.js");
const lendermarketgrabber = require("../grabber/lendermarketgrabber.js");
const esketitgrabber = require("../grabber/esketitgrabber.js");
const solanagrabber = require("../grabber/solanagrabber.js");
const terragrabber = require("../grabber/terragrabber.js");
const genericCosmosGrabber = require("../grabber/genericcosmosgrabber.js");
const store = require("electron-json-storage");
var Mutex = require('async-mutex').Mutex;
const mutex = new Mutex();

const queryAccount = async (arg) => {
  var l = await mutex.runExclusive(async () => {
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
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "PeerBerry":
            balance = await peerberrygrabber.getPeerBerry(accounts[i].user, accounts[i].password);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "Bondster":
            balance = await bondstergrabber.getBondster(accounts[i].user, accounts[i].password);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "EstateGuru":
            balance = await estategurugrabber.getEstateGuru(accounts[i].user, accounts[i].password);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "LendSecured":
            balance = await lendsecuredgrabber.getLendSecured(accounts[i].user, accounts[i].password);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "Lendermarket":
            balance = await lendermarketgrabber.grabLendermarket(accounts[i].user, accounts[i].password);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "Esketit":
            balance = await esketitgrabber.grabEsketit(accounts[i].user, accounts[i].password);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "Solana":
            balance = await solanagrabber.getSolana(accounts[i].address);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "ATOM":
            balance = await genericCosmosGrabber.getGenericCoin("cosmos", "cosmos", 1000000, accounts[i].address);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "KAVA":
            balance = await genericCosmosGrabber.getGenericCoin("kava", "kava", 1000000, accounts[i].address);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "OSMO":
            balance = await genericCosmosGrabber.getGenericCoin("osmosis", "osmosis", 1000000, accounts[i].address);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "CRO":
            balance = await genericCosmosGrabber.getGenericCoin("cryptocom", "crypto-com-chain", 100000000, accounts[i].address);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          case "LUNA":
            balance = await terragrabber.getLUNA(accounts[i].address);
            updateAccountBalances(arg.id, balance);
            return {id : arg.id, data: balance};
          default:
            throw "Unknown provider";
        }
      }
    }
    return null;
  });
  return l;
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
      break;
    }
  }

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
};

function updateAccountBalances(id, balanceData) {
  let balances = store.getSync("balance_" + id);
  if (!balances) {
    balances = {};
  }
  const today = new Date();
  const dateString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  balances[dateString] = balanceData;
  store.set("balance_" + id, balances);
}

exports.addAccount = addAccount;
exports.listAccounts = listAccounts;
exports.deleteAccount = deleteAccount;
exports.updateAccount = updateAccount;
exports.queryAccount = queryAccount;
