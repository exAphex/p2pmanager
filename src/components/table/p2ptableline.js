import React, { Component } from "react";
import { toEuro, getIconByAccountType, getSafeNumber } from "../../utils/utils";
import DeltaIndicator from "./deltaindicator";
import LoadingSpin from "react-loading-spin";

class P2PTableLine extends Component {
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
    var deltaDay = this.getDeltaDay(this.props.deltaOption);
    var deltaInvested = getSafeNumber(this.props.invested) - this.getDeltaDayValue(this.props.balances, deltaDay, "invested");
    var deltaUninvested = getSafeNumber(this.props.uninvested) - this.getDeltaDayValue(this.props.balances, deltaDay, "uninvested");
    var deltaLoss = getSafeNumber(this.props.loss) - this.getDeltaDayValue(this.props.balances, deltaDay, "loss");
    var deltaProfit = getSafeNumber(this.props.profit) - this.getDeltaDayValue(this.props.balances, deltaDay, "profit");
    var deltaTotal = getSafeNumber(this.props.total) - this.getDeltaDayValue(this.props.balances, deltaDay, "total");
    return (
      <tr class="border-b border-gray-200 hover:bg-gray-100">
        <td class="py-3 px-6 whitespace-nowrap">
          <div class="flex">
            <div class="mr-2">{getIconByAccountType(this.props.type)}</div>
            <span class="font-medium">{this.props.name}</span>
            {this.props.isLoading ? <LoadingSpin size="24px" /> : null}
            {this.props.isError ? (
              <div className="text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>{this.formatError(this.props.errorMessage)}</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : null}
          </div>
        </td>
        <td class="py-3 px-6 text-right">
          <div class="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.invested)}</span>
            <DeltaIndicator value={deltaInvested}></DeltaIndicator>
          </div>
        </td>
        <td class="py-3 px-6 text-right">
          <div class="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.uninvested)}</span>
            <DeltaIndicator value={deltaUninvested}></DeltaIndicator>
          </div>
        </td>
        <td class="py-3 px-6 text-right">
          <div class="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.loss)}</span>
            <DeltaIndicator value={deltaLoss}></DeltaIndicator>
          </div>
        </td>
        <td class="py-3 px-6 text-right">
          <div class="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.profit)}</span>
            <DeltaIndicator value={deltaProfit}></DeltaIndicator>
          </div>
        </td>
        <td class="py-3 px-6 text-right">
          <div class="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.total)}</span>
            <DeltaIndicator value={deltaTotal}></DeltaIndicator>
          </div>
        </td>
      </tr>
    );
  }
}

export default P2PTableLine;
