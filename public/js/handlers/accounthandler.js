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

const queryAccounts = (event, arg) => {
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
          case "Solana":
            solanagrabber
              .getSolana(accounts[i].address)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "ATOM":
            genericCosmosGrabber
              .getGenericCoin("cosmos", "cosmos", 1000000, accounts[i].address)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "KAVA":
            genericCosmosGrabber
              .getGenericCoin("kava", "kava", 1000000, accounts[i].address)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "OSMO":
            genericCosmosGrabber
              .getGenericCoin("osmosis", "osmosis", 1000000, accounts[i].address)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "CRO":
            genericCosmosGrabber
              .getGenericCoin("cryptocom", "crypto-com-chain", 100000000, accounts[i].address)
              .then((data) => {
                updateAccountBalances(accounts[i].id, data);
                event.reply("query-account-reply", { id: accounts[i].id, data: data });
              })
              .catch((e) => {
                var retObj = { message: arg, error: e };
                event.reply("query-account-error", retObj);
              });
            break;
          case "LUNA":
            terragrabber
              .getLUNA(accounts[i].address)
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
};

const addAccount = (event, arg) => {
  var accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  accounts.push(arg);

  store.set("accounts", accounts);
  event.reply("list-accounts-reply", accounts);
};

const listAccounts = (event, arg) => {
  var accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  for (var i = 0; i < accounts.length; i++) {
    accounts[i].balances = store.getSync("balance_" + accounts[i].id);
  }
  event.reply("list-accounts-reply", accounts);
};

const deleteAccount = (event, arg) => {
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
};

const updateAccount = (event, arg) => {
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
};

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

exports.queryAccounts = queryAccounts;
exports.addAccount = addAccount;
exports.listAccounts = listAccounts;
exports.deleteAccount = deleteAccount;
exports.updateAccount = updateAccount;
