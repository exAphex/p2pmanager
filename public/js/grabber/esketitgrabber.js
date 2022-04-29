const fetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');

const fetchCo = fetchCookie(fetch);
const api = 'https://esketit.com/api/investor/account-summary';
const oAuthAPI = 'https://esketit.com/api/investor/public/login';
const headers = {
  'Content-Type': 'application/json',
};

const grabEsketit = async (username, password) => {
  const cookie = await getAuthToken(username, password);
  const data = {currencyCode: 'EUR'};
  const response = await fetchCo(api, {method: 'POST', headers: {'cookie': cookie, 'Content-Type': 'application/json'}, body: JSON.stringify(data)});
  const json = await response.json();
  const retObj = {total: json.accountValue, invested: json.principalInvested, uninvested: json.cashBalance, profit: json.totalIncome, loss: json.secondaryMarketTotal};
  return retObj;
};

const getAuthToken = async (username, password) => {
  const data = {email: username, password: password};
  const response = await fetch(oAuthAPI, {method: 'POST', headers: headers, body: JSON.stringify(data)});
  let cookieHeaders = response.headers.get('set-cookie');
  const posJSESSIONID = cookieHeaders.indexOf('auth_inv_token=');
  cookieHeaders = cookieHeaders.substr(posJSESSIONID);
  const posSemicolon = cookieHeaders.indexOf(';');
  cookieHeaders = cookieHeaders.substr(0, posSemicolon);
  return cookieHeaders;
};

exports.grabEsketit = grabEsketit;
