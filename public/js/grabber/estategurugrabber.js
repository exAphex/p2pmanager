const fetch = require('node-fetch');
const FormData = require('form-data');

const api = 'https://estateguru.co/portal/portfolio/account?lang=en';
const authAPI = 'https://estateguru.co/portal/login/authenticate';

const getEstateGuru = async (username, password) => {
  const retAuthData = await getAuthToken(username, password);
  const response = await fetch(api, {method: 'GET', headers: {cookie: retAuthData}});
  const respText = await response.text();
  const retObj = parseTotal(respText);
  return retObj;
};

const parseTotal = (data) => {
  let parseObj = parseNextValue(data, '<h4 class="card-title">', '</h4>');
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
  parseObj = parseNextValue(parseObj.remain, '<span class="item-value">', '</span>');
  const invested = parseFloat(parseObj.value.substr(parseObj.value.indexOf('€') + 1).replaceAll(',', ''));
  return {uninvested: uninvested, total: total, invested: invested, profit: profit, loss: loss};
};

const parseNextValue = (data, findStr, finishStr) => {
  const itemValue = data.indexOf(findStr);
  const newData = data.substr(itemValue + findStr.length);
  const finishPos = newData.indexOf(finishStr);
  return {value: newData.substr(0, finishPos).trim(), remain: data.substr(itemValue + findStr.length + finishPos)};
};

const getAuthToken = async (username, password) => {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const response = await fetch(authAPI, {method: 'POST', body: form});
  let cookieHeaders = response.headers.get('set-cookie');
  const posJSESSIONID = cookieHeaders.indexOf('JSESSIONID=');
  cookieHeaders = cookieHeaders.substr(posJSESSIONID);
  const posSemicolon = cookieHeaders.indexOf(';');
  cookieHeaders = cookieHeaders.substr(0, posSemicolon);
  return cookieHeaders;
};

exports.getEstateGuru = getEstateGuru;
