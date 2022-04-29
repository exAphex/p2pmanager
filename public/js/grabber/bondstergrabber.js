const fetch = require('node-fetch');
const api = 'https://ib.bondster.com/proxy/mktinvestor/api/private/investor/overview';
const authAPI = 'https://ib.bondster.com/proxy/router/api/public/authentication/validateLoginStep';
const headers = {
  'Content-Type': 'application/json',
  'channeluuid': 'f16f67a4-d9ad-400b-af88-f4d8da2dc23e',
  'device': '2671677167.2191270069',
};

const getBondster = async (username, password) => {
  const retAuthData = await getAuthToken(username, password);
  const response = await fetch(api, {method: 'POST', headers: {'Authorization': 'Bearer ' + retAuthData.jwt.value, 'device': '2671677167.2191270069', 'x-account-context': 'EUR'}, body: JSON.stringify({})});
  const json = await response.json();
  const retObj = {total: parseFloat(json.freeSum.amount) + json.investedSum.amount, invested: json.investedSum.amount, uninvested: parseFloat(json.freeSum.amount), profit: json.interestSum.amount, loss: json.feeSum.amount + json.additionalChargeAndDiscountSum.amount};
  return retObj;
};

const getAuthToken = async (username, password) => {
  const data = {
    scenarioCode: 'USR_PWD',
    authProcessStepValues: [
      {authDetailType: 'USERNAME', value: username},
      {authDetailType: 'PWD', value: password},
    ],
  };
  const response = await fetch(authAPI, {method: 'POST', headers: headers, body: JSON.stringify(data)});
  const json = await response.json();
  return json;
};

exports.getBondster = getBondster;
