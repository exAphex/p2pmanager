
const getBalances = (db, id) => {
	const stmt = db.prepare("SELECT * FROM balances where id = ?");
  	let balances = stmt.all(id);
	let retData = {};
	for (let i = 0; i < balances.length; i++) {
		retData[balances[i].date] = {total: balances[i].total, invested: balances[i].invested, uninvested: balances[i].uninvested, loss: balances[i].loss, profit: balances[i].profit};
	}
	return retData;
};

const upsertBalance = (db, id, date, balanceData) => {
	const stmt = db.prepare("SELECT * FROM balances where id = ? AND date = ?");
  	let balances = stmt.all(id, date);
	if (balances.length > 0) {
		const updateStmt = db.prepare("UPDATE balances SET total = ?, uninvested = ?, invested = ?, profit = ?, loss = ? WHERE id = ? and date = ?");
		updateStmt.run(balanceData.total, balanceData.uninvested, balanceData.invested, balanceData.profit, balanceData.loss, id, date);
	} else {
		const insertStmt = db.prepare("INSERT INTO balances VALUES (?,?,?,?,?,?,?)");
		insertStmt.run(id, date, balanceData.total, balanceData.uninvested, balanceData.invested, balanceData.profit, balanceData.loss);
	}
	return getBalances(db, id);
};

exports.getBalances = getBalances;
exports.upsertBalance = upsertBalance;