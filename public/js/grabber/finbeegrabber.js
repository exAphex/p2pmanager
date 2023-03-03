const fetch = require("node-fetch");
const fetchCookie = require("fetch-cookie");
const api = "https://p2p.finbee.lt/loginUser";
const loginPage = "https://p2p.finbee.lt/login";
const dashboardData = "https://p2p.finbee.lt/getLenderDashboardData";
const headers = {
  "content-type": "application/json;charset=UTF-8",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
};

const getFinbee = async (username, password) => {
  const fetchCo = fetchCookie(fetch);
  const xsrfToken = await getXSRFToken(fetchCo);
  await getAuthToken(fetchCo, xsrfToken, username, password);
  const response = await fetchCo(dashboardData, { method: "GET", headers:{"x-csrf-token": xsrfToken, "x-requested-with": "XMLHttpRequest"} });
  const json = await response.json();
  if (response.status > 200) {
    throw Error("Unexpected response status " + response.status);
  }
  const retObj = { total: json.portfolio.account_value, invested: (json.portfolio.funds_offered + json.portfolio.portfolio_value), uninvested: json.portfolio.available_funds, profit: json.roi.net_profit };
  return retObj;
};

const getXSRFToken = async (fetchCo) => {
  const response = await fetchCo(loginPage, { method: "GET" });
  const respText = await response.text();
  const retObj = parseNextValue(respText, 'name="_token" value="', '"');
  return retObj.value;
};

const getAuthToken = async (fetchCo, xsrfToken, username, password) => {
  const data = { email: username, password: password, _token: xsrfToken };
  const response = await fetchCo(api, { method: "POST", headers: headers, body: JSON.stringify(data) });
  const json = await response.text();
  return json;
};

const parseNextValue = (data, findStr, finishStr) => {
  const itemValue = data.indexOf(findStr);
  const newData = data.substr(itemValue + findStr.length);
  const finishPos = newData.indexOf(finishStr);
  return { value: newData.substr(0, finishPos).trim(), remain: data.substr(itemValue + findStr.length + finishPos) };
};

exports.getFinbee = getFinbee;
