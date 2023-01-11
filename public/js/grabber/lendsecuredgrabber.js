const fetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');

const FormData = require('form-data');

const api = 'https://lande.finance/en/investor';
const authAPI = 'https://lande.finance/login';

const getLendSecured = async (username, password) => {
  const fetchCo = fetchCookie(fetch);
  const csrfToken = await getCSRFToken(fetchCo);
  await getCookie(fetchCo,csrfToken, username, password);
  const response = await fetchCo(api, {method: 'GET', headers: {'Content-Type': 'application/json'}});
  const respText = await response.text();
  const retObj = parseTotal(respText);
  return retObj;
};

const getCSRFToken = async (fetchCo) => {
  const response = await fetchCo(authAPI, {method: 'GET'});
  const respText = await response.text();
  const retObj = parseNextValue(respText, 'name="_token" value="', '"');
  
  return {token: retObj.value};
};

const parseTotal = (data) => {
  let parseObj = parseNextValue(data, '<div class="h6 fw-semi-bold mt-2 mb-0">', '</div>');
  const total = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<span class="fw-semi-bold text-success">', '</span>');
  const uninvested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<div class="h6 fw-semi-bold mt-2 mb-0">', '</div>');
  parseObj = parseNextValue(parseObj.remain, '<div class="h6 fw-semi-bold mt-2 mb-0">', '</div>');
  const profit = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  return {uninvested: uninvested, total: total, invested: total - uninvested, profit: profit, loss: 0};
};

const parseNextValue = (data, findStr, finishStr) => {
  const itemValue = data.indexOf(findStr);
  const newData = data.substr(itemValue + findStr.length);
  const finishPos = newData.indexOf(finishStr);
  return {value: newData.substr(0, finishPos).trim(), remain: data.substr(itemValue + findStr.length + finishPos)};
};

const getCookie = async (fetchCo, token, username, password) => {
  const form = new FormData();
  form.append('email', username);
  form.append('password', password);
  form.append('_token', token.token);
  await fetchCo(authAPI, {method: 'POST', body: form, redirect: 'manual'});
};

exports.getLendSecured = getLendSecured;
