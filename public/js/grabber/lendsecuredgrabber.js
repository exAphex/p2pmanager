const fetch = require('node-fetch');
const fetchCookie = require('fetch-cookie');

const fetchCo = fetchCookie(fetch);
const FormData = require('form-data');

const api = 'https://lendsecured.eu/en/investor';
const authAPI = 'https://lendsecured.eu/en/login';

const getLendSecured = async (username, password) => {
  const csrfToken = await getCSRFToken();
  await getCookie(csrfToken, username, password);
  const response = await fetchCo(api, {method: 'GET', headers: {'Content-Type': 'application/json'}});
  const respText = await response.text();
  const retObj = parseTotal(respText);
  return retObj;
};

const getCSRFToken = async () => {
  const response = await fetchCo(authAPI, {method: 'GET'});
  const respText = await response.text();
  const retObj = parseNextValue(respText, 'name="_token" value="', '"');

  let cookieHeaders = response.headers.get('set-cookie');
  const posJSESSIONID = cookieHeaders.indexOf('lendsecured_session=');
  cookieHeaders = cookieHeaders.substr(posJSESSIONID);
  const posSemicolon = cookieHeaders.indexOf(';');
  cookieHeaders = cookieHeaders.substr(0, posSemicolon);
  return {token: retObj.value, cookie: cookieHeaders};
};

const parseTotal = (data) => {
  let parseObj = parseNextValue(data, '<div class="h6 font-weight-normal mt-2 mb-0">', '</div>');
  const total = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<span class="font-weight-bold text-primary">', '</span>');
  const uninvested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  parseObj = parseNextValue(parseObj.remain, '<div class="h6 font-weight-normal mt-2 mb-0">', '</div>');
  parseObj = parseNextValue(parseObj.remain, '<div class="h6 font-weight-normal mt-2 mb-0">', '</div>');
  const profit = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  return {uninvested: uninvested, total: total, invested: total - uninvested, profit: profit, loss: 0};
};

const parseNextValue = (data, findStr, finishStr) => {
  const itemValue = data.indexOf(findStr);
  const newData = data.substr(itemValue + findStr.length);
  const finishPos = newData.indexOf(finishStr);
  return {value: newData.substr(0, finishPos).trim(), remain: data.substr(itemValue + findStr.length + finishPos)};
};

const getCookie = async (token, username, password) => {
  const form = new FormData();
  form.append('email', username);
  form.append('password', password);
  form.append('_token', token.token);
  const response = await fetchCo(authAPI, {method: 'POST', body: form, redirect: 'manual'});

  let cookieHeaders = response.headers.get('set-cookie');
  const posJSESSIONID = cookieHeaders.indexOf('lendsecured_session=');
  cookieHeaders = cookieHeaders.substr(posJSESSIONID);
  const posSemicolon = cookieHeaders.indexOf(';');
  cookieHeaders = cookieHeaders.substr(0, posSemicolon);
  return cookieHeaders;
};

exports.getLendSecured = getLendSecured;
