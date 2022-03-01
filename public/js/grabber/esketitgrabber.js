const fetch = require("node-fetch");
const fetchCookie = require("fetch-cookie");

const fetchCo = fetchCookie(fetch);
const api = "https://esketit.com/api/investor/account-summary";
const oAuthAPI = "https://esketit.com/api/investor/public/login";
const headers = {
  "Content-Type": "application/json",
};

const grabEsketit = async (username, password) => {
  var cookie = await getAuthToken(username, password);
  var data = { currencyCode: "EUR" };
  const response = await fetchCo(api, { method: "POST", headers: { cookie: cookie, "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const json = await response.json();
  var retObj = { total: json.accountValue, invested: json.principalInvested, uninvested: json.cashBalance, profit: json.totalIncome, loss: json.secondaryMarketTotal };
  return retObj;
};

const getAuthToken = async (username, password) => {
  var data = { email: username, password: password };
  const response = await fetch(oAuthAPI, { method: "POST", headers: headers, body: JSON.stringify(data) });
  var cookieHeaders = response.headers.get("set-cookie");
  var posJSESSIONID = cookieHeaders.indexOf("auth_inv_token=");
  cookieHeaders = cookieHeaders.substr(posJSESSIONID);
  var posSemicolon = cookieHeaders.indexOf(";");
  cookieHeaders = cookieHeaders.substr(0, posSemicolon);
  return cookieHeaders;
};

exports.grabEsketit = grabEsketit;
