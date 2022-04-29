const fetch = require('node-fetch');
const api = 'https://api.peerberry.com/v1/investor/overview';
const oAuthAPI = 'https://api.peerberry.com/v1/investor/login';
const headers = {
  'Content-Type': 'application/json',
};

const getPeerBerry = async (username, password) => {
  const retAuthData = await getAuthToken(username, password);
  const response = await fetch(api, {method: 'GET', headers: {authorization: 'Bearer ' + retAuthData.access_token}});
  const json = await response.json();
  if (response.status > 200) {
    throw Error('Unexpected response status ' + response.status);
  }
  const retObj = {total: parseFloat(json.totalBalance), invested: parseFloat(json.investments.total), uninvested: parseFloat(json.availableMoney), profit: parseFloat(json.totalProfit)};
  return retObj;
};

const getAuthToken = async (username, password) => {
  const data = {email: username, password: password};
  const response = await fetch(oAuthAPI, {method: 'POST', headers: headers, body: JSON.stringify(data)});
  const json = await response.json();
  return json;
};

exports.getPeerBerry = getPeerBerry;
