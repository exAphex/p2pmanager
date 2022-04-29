const fetch = require('node-fetch');
const api = 'https://lcd.terra.dev/cosmos/bank/v1beta1/balances/';
const apiStake = 'https://api.extraterrestrial.finance/v1/staking/';
const priceAPI = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=eur&ids=terra-luna';

const getLUNA = async (address) => {
  const response = await fetch(api + address, {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const json = await response.json();
  let total = 0;
  let stake = 0;
  if (json.balances && json.balances.length > 0) {
    for (let i = 0; i < json.balances.length; i++) {
      if (json.balances[i].denom == 'uluna') {
        total = json.balances[i].amount * 1;
      }
    }
  }

  const responseStake = await fetch(apiStake + address, {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const jsonStake = await responseStake.json();

  if (jsonStake.delegationTotal) {
    stake += jsonStake.delegationTotal * 1;
    total += stake;
  }

  const responsePrice = await fetch(priceAPI, {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const jsonPrice = await responsePrice.json();

  const retObj = {total: parseFloat(total / 1000000), staked: parseFloat(stake / 1000000), rewards: 0, price: parseFloat(jsonPrice['terra-luna'].eur)};
  return retObj;
};

exports.getLUNA = getLUNA;
