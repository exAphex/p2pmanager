const fetch = require("node-fetch");
const api = "https://api.solscan.io/account?address=";
const apiStake = "https://api.solscan.io/account/stake?address=";
const priceAPI = "https://api.coingecko.com/api/v3/simple/price?vs_currencies=eur&ids=solana";

const getSolana = async (address) => {
  const response = await fetch(api + address, { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "PostmanRuntime/7.26.8" } });
  const json = await response.json();
  var total = json.data.lamports;
  var stake = 0;

  const responseStake = await fetch(apiStake + address, { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "PostmanRuntime/7.26.8" } });
  const jsonStake = await responseStake.json();

  var stakeAccounts = jsonStake.data;
  for (var acc in stakeAccounts) {
    var obj = stakeAccounts[acc];
    total += obj.amount * 1;
    stake += obj.amount * 1;
  }

  const responsePrice = await fetch(priceAPI, { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "PostmanRuntime/7.26.8" } });
  const jsonPrice = await responsePrice.json();

  var retObj = { total: parseFloat(total / 1000000000), staked: parseFloat(stake / 1000000000), rewards: 0, price: parseFloat(jsonPrice.solana.eur) };
  return retObj;
};

exports.getSolana = getSolana;
