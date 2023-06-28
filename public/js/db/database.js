const {app} = require('electron');
console.log(app.getPath('userData'));
const db = require('better-sqlite3')(app.getPath('userData')+ '/accounts.db');
const { listAccountsStore } = require('../handlers/accounthandler.js');
const schemaVersion = 1;


const insertVersion = (ver) => {
	const insertStmt = db.prepare("INSERT INTO version VALUES (?)");
	insertStmt.run(ver);
};

const migrate = (version) => {
	if (version < 1) {
		db.exec("CREATE TABLE accounts (id TEXT NOT NULL,name TEXT NOT NULL,type TEXT NOT NULL,user TEXT,password TEXT,description TEXT, lastUpdated INTEGER)");
		let accounts = listAccountsStore();
		for (let i = 0; i < accounts.length; i++) {
			const insertStmt = db.prepare("INSERT INTO accounts VALUES (?,?,?,?,?,?,?)");
			insertStmt.run(accounts[i].id, accounts[i].name, accounts[i].type, accounts[i].user, accounts[i].password, accounts[i].description, accounts[i].lastUpdated);
		}	
		insertVersion(1);
	} else if (version < 2) {
		db.exec("CREATE TABLE balances (id TEXT NOT NULL,date TEXT NOT NULL, total REAL, uninvested REAL, invested REAL, profit REAL, loss REAL)");
		db.exec("CREATE UNIQUE INDEX idx_balance_user_date ON balances (id, date)");
		let accounts = listAccountsStore();
		for (let i = 0; i < accounts.length; i++) {
			for (var key in accounts[i].balances) {
				const insertStmt = db.prepare("INSERT INTO balances VALUES (?,?,?,?,?,?,?)");
				insertStmt.run(accounts[i].id, key, accounts[i].balances[key].total, accounts[i].balances[key].uninvested, accounts[i].balances[key].invested, accounts[i].balances[key].profit, accounts[i].balances[key].loss);
			}
		}	
		insertVersion(2);
	}
	return (schemaVersion <= version);
};

const getDatabase = () => {
	return db;
};

const prepareDB = () => {
	db.exec(`
  CREATE TABLE IF NOT EXISTS version (version INT);
  `);
  const stmt = db.prepare("SELECT * FROM version ORDER BY version DESC LIMIT 1");
  const retVersion = stmt.all();
  let dbVersion = (retVersion.length > 0) ? retVersion[0].version : 0;
  while(!migrate(dbVersion)) {
	dbVersion++;
  }
};

db.pragma("journal_mode = WAL");
prepareDB();

exports.getDatabase = getDatabase;