const fetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');


const headers = {
  'Content-Type': 'application/json',
};
const api = 'https://app.estateguru.co/portfolio/ajaxFillAccountAndLoanData';
const authAPI = 'https://account.estateguru.co/api/login';
const defaultAccountAPI = 'https://account.estateguru.co/api/user/info?username=';

const getEstateGuru = async (username, password) => {
  const fetchCo = fetchCookie(fetch);
  const data = {username: username, rememberMe:false, password: password};
  await fetchCo(authAPI, {method: 'POST', headers: headers, body: JSON.stringify(data)})
  const defaultAccount = await getDefaultAccountId(fetchCo, username);
  await fetchCo('https://account.estateguru.co/api/account/' + defaultAccount + '/switch', {method: 'POST'});
  await fetchCo('https://account.estateguru.co/api/account/' + defaultAccount, {method: 'GET'});
  const response = await fetchCo(api, {method: 'GET'});
  const respText = await response.text();
  const retObj = parseTotal(respText);
  return retObj;
};

const getDefaultAccountId = async (fetchCo, username) => {
  const responseS = await fetchCo(defaultAccountAPI + username, {method: 'GET'});
  const respJSON = await responseS.json();
  return respJSON.defaultAccountId;
};

const parseTotal = (data) => {
  let parseObj = parseNextValue(data, '<h4 class="card-title">', '</h4>');
  parseObj = parseNextValue(parseObj.remain, '<h4 class="card-title">', '</h4>');
  parseObj = parseNextValue(parseObj.remain, '<h4 class="card-title">', '</h4>');
  const uninvested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  const total = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  const profit = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  const loss = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', '')) * -1;
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  //parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  const invested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  return {uninvested: uninvested, total: total, invested: invested, profit: profit, loss: loss};
};

const parseNextValue = (data, findStr, finishStr) => {
  const itemValue = data.indexOf(findStr);
  const newData = data.substr(itemValue + findStr.length);
  const finishPos = newData.indexOf(finishStr);
  return {value: newData.substr(0, finishPos).trim(), remain: data.substr(itemValue + findStr.length + finishPos)};
};

exports.getEstateGuru = getEstateGuru;
