import React from "react";
import { getCategoryByType } from "../../utils/utils";

class GenericTile extends React.Component {
  toCurrencyString(amount) {
    if (!amount) {
      amount = 0;
    }
    return amount.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    });
  }

  componentDidMount() {
    this.setState({ colNum: this.props.colNum });
  }

  getDeltaDay(option) {
    var retDay = new Date();
    retDay.setDate(retDay.getDate() - 1);
    switch (option) {
      case "1":
        retDay = new Date();
        retDay.setDate(retDay.getDate() - 7);
        break;
      case "2":
        retDay = new Date();
        retDay.setMonth(retDay.getMonth() - 1);
        break;
      case "3":
        retDay = new Date();
        retDay.setFullYear(retDay.getFullYear() - 1);
        break;
      default:
        retDay = new Date();
        retDay.setDate(retDay.getDate() - 1);
        break;
    }
    return retDay;
  }

  calculateAbsoluteProperty(accounts) {
    var retData = { total: 0, invested: 0, uninvested: 0, loss: 0, profit: 0, staked: 0, rewards: 0 };
    accounts.forEach((element) => {
      var total = element.total;
      if (getCategoryByType(element.type) === "CRYPTO") {
        total = element.total * (element.price ? element.price : 0);
      }
      retData.total += total ? total : 0;
      retData.invested += element.invested ? element.invested : 0;
      retData.uninvested += element.uninvested ? element.uninvested : 0;
      retData.loss += element.loss ? element.loss : 0;
      retData.profit += element.profit ? element.profit : 0;
      retData.staked += element.staked ? element.staked * (element.price ? element.price : 0) : 0;
      retData.rewards += element.rewards ? element.rewards * (element.price ? element.price : 0) : 0;
    });
    return retData;
  }

  getDeltaDayValue(accounts, date) {
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    var retData = { total: 0, invested: 0, uninvested: 0, loss: 0, profit: 0, staked: 0, rewards: 0 };
    accounts.forEach((element) => {
      if (getCategoryByType(element.type) === "CRYPTO") {
        retData.total += element.balances[dateString] && element.balances[dateString].total ? element.balances[dateString].total * (element.balances[dateString].price ? element.balances[dateString].price : 0) : 0;
      } else {
        retData.total += element.balances[dateString] && element.balances[dateString].total ? element.balances[dateString].total : 0;
      }

      retData.invested += element.balances[dateString] && element.balances[dateString].invested ? element.balances[dateString].invested : 0;
      retData.uninvested += element.balances[dateString] && element.balances[dateString].uninvested ? element.balances[dateString].uninvested : 0;
      retData.loss += element.balances[dateString] && element.balances[dateString].loss ? element.balances[dateString].loss : 0;
      retData.profit += element.balances[dateString] && element.balances[dateString].profit ? element.balances[dateString].profit : 0;
      retData.staked += element.balances[dateString] && element.balances[dateString].staked ? element.balances[dateString].staked * (element.balances[dateString].price ? element.balances[dateString].price : 0) : 0;
      retData.rewards += element.balances[dateString] && element.balances[dateString].rewards ? element.balances[dateString].rewards * (element.balances[dateString].price ? element.balances[dateString].price : 0) : 0;
    });
    return retData;
  }

  getDeltaAbsoluteValue(deltaObj, absoluteObj) {
    return {
      total: absoluteObj.total - deltaObj.total,
      invested: absoluteObj.invested - deltaObj.invested,
      uninvested: absoluteObj.uninvested - deltaObj.uninvested,
      loss: absoluteObj.loss - deltaObj.loss,
      profit: absoluteObj.profit - deltaObj.profit,
      staked: absoluteObj.staked - deltaObj.staked,
      rewards: absoluteObj.rewards - deltaObj.rewards,
    };
  }

  render() {
    return;
  }
}

export default GenericTile;
