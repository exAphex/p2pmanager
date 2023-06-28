
const listAccounts = (db) => {
	const stmt = db.prepare("SELECT * FROM accounts");
  	return stmt.all();
};


const getAccount = (db, id) => {
	const stmt = db.prepare("SELECT * FROM accounts where id = ?");
  	return stmt.all(id);
};

const createAccount = (db, account) => { 
	const insertStmt = db.prepare("INSERT INTO accounts VALUES (?,?,?,?,?,?,?)");
	insertStmt.run(account.id, account.name, account.type, account.user, account.password, account.description, account.lastUpdated);
	return listAccounts(db);
};

const deleteAccount = (db, accountID) => {
	const insertStmt = db.prepare("DELETE FROM accounts where id = ?");
	insertStmt.run(accountID);
	return listAccounts(db);	
}

const updateAccount = (db, account) => {
	const today = new Date();
	const insertStmt = db.prepare("UPDATE accounts SET name = ?, user = ?, password = ?, description = ?, lastUpdated = ? where ID = ?");
	insertStmt.run(account.name, account.user, account.password, account.description, today.getTime() - today.getTimezoneOffset() * 60000, account.id);
	return listAccounts(db);	
}

const updateAccountLastUpdated = (db, id, lastUpdated) => {
	const insertStmt = db.prepare("UPDATE accounts SET lastUpdated = ? where ID = ?");
	insertStmt.run(lastUpdated, id);
	return listAccounts(db);	
}

exports.updateAccount = updateAccount;
exports.updateAccountLastUpdated = updateAccountLastUpdated;
exports.listAccounts = listAccounts;
exports.createAccount = createAccount;
exports.deleteAccount = deleteAccount;
exports.getAccount = getAccount;