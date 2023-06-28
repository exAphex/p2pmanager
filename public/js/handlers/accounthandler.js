const getincomegrabber = require("../grabber/getincomegrabber.js");
const peerberrygrabber = require("../grabber/peerberrygrabber.js");
const bondstergrabber = require("../grabber/bondstergrabber.js");
const estategurugrabber = require("../grabber/estategurugrabber.js");
const lendsecuredgrabber = require("../grabber/lendsecuredgrabber.js");
const lendermarketgrabber = require("../grabber/lendermarketgrabber.js");
const esketitgrabber = require("../grabber/esketitgrabber.js");
const finbeegrabber = require("../grabber/finbeegrabber.js");
const store = require("electron-json-storage");
var Mutex = require("async-mutex").Mutex;
const mutex = new Mutex();
const userDAO = require("../db/userdao.js");
const balanceDAO = require("../db/balancedao.js");

const queryAccount = async (database, arg) => {
  let lastUpdated = 0;
  let accList = userDAO.getAccount(database, arg.id);
  if (accList.length == 0) {
    return null;
  }
  let account = accList[0];
      let balance = {};
      switch (account.type) {
        case "GetIncome":
          balance = await getincomegrabber.grabGetIncome(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "PeerBerry":
          balance = await peerberrygrabber.getPeerBerry(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "Bondster":
          balance = await bondstergrabber.getBondster(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "EstateGuru":
          balance = await estategurugrabber.getEstateGuru(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "LendSecured":
          balance = await lendsecuredgrabber.getLendSecured(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "Lendermarket":
          balance = await lendermarketgrabber.grabLendermarket(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "Esketit":
          balance = await esketitgrabber.grabEsketit(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        case "Finbee":
          balance = await finbeegrabber.getFinbee(account.user, account.password);
          lastUpdated = await updateAccountBalances(database, arg.id, balance);
          break;
        default:
          throw "Unknown provider";
      }
      return { id: arg.id, data: balance, lastUpdated };

};

const addAccount = (event, database, arg) => {
  let accounts = userDAO.createAccount(database, arg);
  event.reply("list-accounts-reply", accounts);
};

const listAccounts = (event, db) => {
  let accounts = userDAO.listAccounts(db);
  for (let i = 0; i < accounts.length; i++) {
    accounts[i].balances = balanceDAO.getBalances(db, accounts[i].id);
  }
  event.reply("list-accounts-reply", accounts);
};

const listAccountsStore = () => {
  let accounts = store.getSync("accounts");
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  for (let i = 0; i < accounts.length; i++) {
    accounts[i].balances = store.getSync("balance_" + accounts[i].id);
  }
  return accounts;
};

const deleteAccount = (event, database, arg) => {
  let accounts = userDAO.deleteAccount(database, arg);
  event.reply("list-accounts-reply", accounts);
};

const updateAccount = (event, database, arg) => {
  let accounts = userDAO.updateAccount(database, arg);
  event.reply("list-accounts-reply", accounts);
};

const updateAccountBalances = async (database, id, balanceData) => {
  const today = new Date();
  userDAO.updateAccountLastUpdated(database, id, today.getTime() - today.getTimezoneOffset() * 60000);

  const dateString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  balanceDAO.upsertBalance(database, id, dateString, balanceData);
  return today;
};

exports.addAccount = addAccount;
exports.listAccounts = listAccounts;
exports.listAccountsStore = listAccountsStore;
exports.deleteAccount = deleteAccount;
exports.updateAccount = updateAccount;
exports.queryAccount = queryAccount;
