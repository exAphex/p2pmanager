const fetch = require('node-fetch');
const api = '.cosmostation.io/cosmos/bank/v1beta1/balances/';
const apiStake = '.cosmostation.io/cosmos/staking/v1beta1/delegations/';
const apiReward = '.cosmostation.io/cosmos/distribution/v1beta1/delegators/';
const priceAPI = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=eur&ids=';

const getGenericCoin = async (coin, coingeckoId, factor, address) => {
  const response = await fetch('https://lcd-' + coin + api + address, {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const json = await response.json();
  let total = 0;
  let rewards = 0;
  let stake = 0;
  if (json.balances && json.balances.length > 0) {
    for (let i = 0; i < json.balances.length; i++) {
      total = json.balances[i].amount * 1;
    }
  }

  const responseStake = await fetch('https://lcd-' + coin + apiStake + address, {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const jsonStake = await responseStake.json();

  if (jsonStake.delegation_responses && jsonStake.delegation_responses.length > 0) {
    for (let i = 0; i < jsonStake.delegation_responses.length; i++) {
      stake += jsonStake.delegation_responses[i].balance.amount * 1;
    }
    total += stake;
  }

  const responseRewards = await fetch('https://lcd-' + coin + apiReward + address + '/rewards', {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const jsonRewards = await responseRewards.json();
  if (jsonRewards.total && jsonRewards.total.length > 0) {
    for (let i = 0; i < jsonRewards.total.length; i++) {
      rewards += jsonRewards.total[i].amount * 1;
    }
    total += rewards;
  }

  const responsePrice = await fetch(priceAPI + coingeckoId, {method: 'GET', headers: {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': 'PostmanRuntime/7.26.8'}});
  const jsonPrice = await responsePrice.json();

  const retObj = {total: parseFloat(total / factor), staked: parseFloat(stake / factor), rewards: parseFloat(rewards / factor), price: parseFloat(jsonPrice[coingeckoId].eur)};
  return retObj;
};

exports.getGenericCoin = getGenericCoin;
