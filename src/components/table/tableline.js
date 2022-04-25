import { Component } from "react";
import { getSafeNumber } from "../../utils/utils";

class TableLine extends Component {
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

  getDeltaDayValue(balances, date, prop) {
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    if (!balances || !balances[dateString]) {
      return 0;
    } else {
      return getSafeNumber(balances[dateString][prop]);
    }
  }

  formatError(e) {
    if (!e) {
      return "";
    }

    if (e instanceof String) {
      return e;
    }

    if (e.message) {
      return e.message;
    }

    return "Unkown error!";
  }

  render() {
    return;
  }
}

export default TableLine;
