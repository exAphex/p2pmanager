const fetch = require("node-fetch");
const api = "https://lcd-kava.cosmostation.io/cosmos/bank/v1beta1/balances/";
const apiStake = "https://lcd-kava.cosmostation.io/cosmos/staking/v1beta1/delegations/";
const apiReward = "https://lcd-kava.cosmostation.io/cosmos/distribution/v1beta1/delegators/";

const getKAVA = async (address) => {
  const response = await fetch(api + address, { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "PostmanRuntime/7.26.8" } });
  const json = await response.json();
  var total = 0;
  var rewards = 0;
  var stake = 0;
  if (json.balances && json.balances.length > 0) {
    for (var i = 0; i < json.balances.length; i++) {
      total = json.balances[i].amount * 1;
    }
  }

  const responseStake = await fetch(apiStake + address, { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "PostmanRuntime/7.26.8" } });
  const jsonStake = await responseStake.json();

  if (jsonStake.delegation_responses && jsonStake.delegation_responses.length > 0) {
    for (var i = 0; i < jsonStake.delegation_responses.length; i++) {
      stake += jsonStake.delegation_responses[i].balance.amount * 1;
    }
    total += stake;
  }

  const responseRewards = await fetch(apiReward + address + "/rewards", { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "PostmanRuntime/7.26.8" } });
  const jsonRewards = await responseRewards.json();
  if (jsonRewards.total && jsonRewards.total.length > 0) {
    for (var i = 0; i < jsonRewards.total.length; i++) {
      rewards += jsonRewards.total[i].amount * 1;
    }
    total += rewards;
  }

  var retObj = { total: parseFloat(total / 1000000), staked: parseFloat(stake / 1000000), rewards: parseFloat(rewards / 1000000) };
  return retObj;
};

exports.getKAVA = getKAVA;
