const fetch = require("node-fetch");
const api = "https://backoffice.getincome.com/api/investor-details";
const oAuthAPI = "https://backoffice.getincome.com/api/auth0-login";
const headers = {
  "Content-Type": "application/json",
};

const grabGetIncome = async (username, password) => {
  var retAuthData = await getAuthToken(username, password);
  const response = await fetch(api, { method: "GET", headers: { authorization: "Bearer " + retAuthData.accessToken } });
  const json = await response.json();
  var retObj = { total: json.funds.total, invested: json.funds.invested, uninvested: json.funds.available, profit: json.earnings.interest };
  return retObj;
};

const getAuthToken = async (username, password) => {
  var data = { username: username, password: password };
  const response = await fetch(oAuthAPI, { method: "POST", headers: headers, body: JSON.stringify(data) });
  const json = await response.json();
  return json;
};

exports.grabGetIncome = grabGetIncome;
