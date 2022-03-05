import React from "react";

class OverviewTileLine extends React.Component {
  state = { total: "DASHBOARD" };

  calculcateHistoricTimeLine(accounts) {
    var accs = [];
    accounts.forEach((element) => {
      var elem = element;
      var obj = {};
      var balances = element.balances;
      var minDate = this.getMinDate(balances);
      var todayDate = this.getTodayDate();
      var lastObj = null;
      while (minDate <= todayDate) {
        if (element.balances[minDate]) {
          lastObj = element.balances[minDate];
        }
        obj[minDate] = lastObj;
        var cursorDate = new Date(minDate);
        cursorDate.setDate(cursorDate.getDate() + 1);
        minDate = new Date(cursorDate.getTime() - cursorDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      }
      elem.balances = obj;
      accs.push(element);
    });
    return accs;
  }

  getTodayDate() {
    var today = new Date();
    var minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    return minDate;
  }

  getMinDate(balances) {
    var today = new Date();
    var minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    for (var b in balances) {
      if (minDate > b) {
        minDate = b;
      }
    }
    return minDate;
  }

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

  calculateAbsoluteProperty(accounts, property) {
    var retData = 0;
    accounts.forEach((element) => {
      retData += element[property] ? element[property] : 0;
    });
    return retData;
  }

  calculateDiffByPropertyGeneric(accounts, property, date) {
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    var retData = 0;
    accounts.forEach((element) => {
      var balanceDay = element.balances[dateString];
      if (balanceDay && balanceDay[property]) {
        retData += balanceDay[property];
      }
    });
    return retData;
  }

  calculateDiffDayByProperty(accounts, property, total) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var retData = total - this.calculateDiffByPropertyGeneric(accounts, property, yesterday);
    return retData;
  }

  calculateDiffWeekByProperty(accounts, property, total) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 7);
    var retData = total - this.calculateDiffByPropertyGeneric(accounts, property, yesterday);
    return retData;
  }

  calculateDiffMonthByProperty(accounts, property, total) {
    var yesterday = new Date();
    yesterday.setMonth(yesterday.getMonth() - 1);
    var retData = total - this.calculateDiffByPropertyGeneric(accounts, property, yesterday);
    return retData;
  }

  calculateDiffYearByProperty(accounts, property, total) {
    var yesterday = new Date();
    yesterday.setFullYear(yesterday.getFullYear() - 1);
    var retData = total - this.calculateDiffByPropertyGeneric(accounts, property, yesterday);
    return retData;
  }

  calculateFormatted(accounts, property) {
    return this.toCurrencyString(this.calculateAbsoluteProperty(accounts, property));
  }

  formatNumber(num) {
    return this.toCurrencyString(num);
  }

  calculateTotal(accounts) {
    return this.calculateAbsoluteProperty(accounts, this.props.property);
  }

  render() {
    var accs = this.calculcateHistoricTimeLine(this.props.accounts);
    var total = this.calculateTotal(accs);
    var diffDay = this.calculateDiffDayByProperty(accs, this.props.property, total);
    var diffWeek = this.calculateDiffWeekByProperty(accs, this.props.property, total);
    var diffMonth = this.calculateDiffMonthByProperty(accs, this.props.property, total);
    var diffYear = this.calculateDiffYearByProperty(accs, this.props.property, total);
    return (
      <>
        <div className="col-start-1 font-semibold grid grid-cols-2">
          <div>{this.props.name}:</div>
          <div className="text-right ">{this.formatNumber(total)}</div>
        </div>
        <div className={"text-right " + (diffDay >= 0 ? "text-green-500" : "text-red-500")}>{(diffDay >= 0 ? "+ " : "- ") + this.toCurrencyString(diffDay)}</div>
        <div className={"text-right " + (diffWeek >= 0 ? "text-green-500" : "text-red-500")}>{(diffWeek >= 0 ? "+ " : "- ") + this.toCurrencyString(diffWeek)}</div>
        <div className={"text-right " + (diffMonth >= 0 ? "text-green-500" : "text-red-500")}>{(diffMonth >= 0 ? "+ " : "- ") + this.toCurrencyString(diffMonth)}</div>
        <div className={"text-right " + (diffYear >= 0 ? "text-green-500" : "text-red-500")}>{(diffYear >= 0 ? "+ " : "- ") + this.toCurrencyString(diffYear)}</div>
      </>
    );
  }
}

export default OverviewTileLine;
