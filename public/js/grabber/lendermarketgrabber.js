const fetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');

const fetchCo = fetchCookie(fetch);
const FormData = require('form-data');
const api = 'https://www.lendermarket.com/summary';
const authAPI = 'https://www.lendermarket.com/account/login';

const grabLendermarket = async (username, password) => {
  const csrfToken = await getCSRFToken();
  await getToken(username, password, csrfToken);
  const response = await fetchCo(api, {method: 'GET', headers: {'Content-Type': 'application/json'}});
  const respText = await response.text();

  const retObj = parseTotal(respText);
  return retObj;
};

const parseTotal = (data) => {
  let parseObj = parseNextValue(data, '<td>Account value</td>\n<td><span title="', '"');
  const total = parseFloat(parseObj.value);
  parseObj = parseNextValue(parseObj.remain, '<td>- Invested funds</td>\n<td><span title="', '"');
  const invested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<td>- Available funds</td>\n<td><span title="', '"');
  const uninvested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<td>Profit</td>\n<td><span title="', '"');
  const profit = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  return {uninvested: uninvested, total: total, invested: invested, profit: profit, loss: 0};
};

const getCSRFToken = async () => {
  const response = await fetchCo(authAPI, {method: 'GET'});
  const respText = await response.text();
  const retObj = parseNextValue(respText, 'name="_csrf" value="', '"');
  return retObj.value;
};

const getToken = async (username, password, csrfToken) => {
  const form = new FormData();
  form.append('LoginForm[identificator]', username);
  form.append('LoginForm[password]', password);
  form.append('_csrf', csrfToken);
  await fetchCo(authAPI, {method: 'POST', body: form, redirect: 'manual'});
};

const parseNextValue = (data, findStr, finishStr) => {
  const itemValue = data.indexOf(findStr);
  const newData = data.substr(itemValue + findStr.length);
  const finishPos = newData.indexOf(finishStr);
  return {value: newData.substr(0, finishPos).trim(), remain: data.substr(itemValue + findStr.length + finishPos)};
};

exports.grabLendermarket = grabLendermarket;
