import React from "react";
import { getCategoryByType } from "../../utils/utils";

class OverviewTile extends React.Component {
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
    var overViewData = this.calculateAbsoluteProperty(this.props.accounts);
    var deltaDay = this.getDeltaDay(this.props.deltaOption);
    var deltaObj = this.getDeltaDayValue(this.props.accounts, deltaDay);
    var absObj = this.getDeltaAbsoluteValue(deltaObj, overViewData);
    return (
      <div className={"shadow p-4 grid grid-cols-" + (this.props.colNum + "")}>
        <div className="pb-2 col-start-1 text-right font-semibold">Total</div>
        {this.props.viewType === "P2P" || this.props.viewType === "OVERVIEW" ? (
          <>
            <div className="text-right font-semibold">Invested</div>
            <div className="text-right font-semibold">Uninvested</div>
            <div className="text-right font-semibold">Loss</div>
            <div className="text-right font-semibold">Profit</div>
          </>
        ) : (
          <></>
        )}

        {this.props.viewType === "CRYPTO" || this.props.viewType === "OVERVIEW" ? (
          <>
            <div className="text-right font-semibold">Staked</div>
            <div className="text-right font-semibold">Rewards</div>
          </>
        ) : (
          <></>
        )}

        <div className="col-start-1 text-right">{this.toCurrencyString(overViewData.total)}</div>
        {this.props.viewType === "P2P" || this.props.viewType === "OVERVIEW" ? (
          <>
            <div className="text-right ">{this.toCurrencyString(overViewData.invested)}</div>
            <div className="text-right ">{this.toCurrencyString(overViewData.uninvested)}</div>
            <div className="text-right ">{this.toCurrencyString(overViewData.loss)}</div>
            <div className="text-right ">{this.toCurrencyString(overViewData.profit)}</div>
          </>
        ) : (
          <></>
        )}

        {this.props.viewType === "CRYPTO" || this.props.viewType === "OVERVIEW" ? (
          <>
            <div className="text-right ">{this.toCurrencyString(overViewData.staked)}</div>
            <div className="text-right ">{this.toCurrencyString(overViewData.rewards)}</div>
          </>
        ) : (
          <></>
        )}

        <div className={"col-start-1 text-right " + (absObj.total >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.total >= 0 ? "+ " : "") + this.toCurrencyString(absObj.total)}</div>
        {this.props.viewType === "P2P" || this.props.viewType === "OVERVIEW" ? (
          <>
            <div className={"text-right " + (absObj.invested >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.invested >= 0 ? "+ " : "") + this.toCurrencyString(absObj.invested)}</div>
            <div className={"text-right " + (absObj.uninvested >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.uninvested >= 0 ? "+ " : "") + this.toCurrencyString(absObj.uninvested)}</div>
            <div className={"text-right " + (absObj.loss >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.loss >= 0 ? "+ " : "") + this.toCurrencyString(absObj.loss)}</div>
            <div className={"text-right " + (absObj.profit >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.profit >= 0 ? "+ " : "") + this.toCurrencyString(absObj.profit)}</div>
          </>
        ) : (
          <></>
        )}

        {this.props.viewType === "CRYPTO" || this.props.viewType === "OVERVIEW" ? (
          <>
            <div className={"text-right " + (absObj.staked >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.staked >= 0 ? "+ " : "") + this.toCurrencyString(absObj.staked)}</div>
            <div className={"text-right " + (absObj.rewards >= 0 ? "text-green-500" : "text-red-500")}>{(absObj.rewards >= 0 ? "+ " : "") + this.toCurrencyString(absObj.rewards)}</div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default OverviewTile;
