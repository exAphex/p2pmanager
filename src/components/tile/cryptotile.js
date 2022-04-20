import React from "react";
import LoadingSpin from "react-loading-spin";

class CryptoTile extends React.Component {
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

  getDeltaDayValue(balances, date) {
    var dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    if (!balances || !balances[dateString]) {
      return 0;
    } else {
      return balances[dateString].total;
    }
  }

  toFixed(amount) {
    if (!amount) {
      amount = 0;
    }
    return amount.toFixed(8);
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
    var deltaDayValue = this.getDeltaDayValue(this.props.balances, deltaDay);
    var delta = this.props.total - deltaDayValue;
    return (
      <div className="inline-block w-full  lg:w-1/2 p-2">
        <div className="align-bottom bg-white shadow w-full bg-white p-4">
          <div className="mt-1">
            <div className="flex flex-wrap space-x-3 items-center pr-3">
              <h3 className="text-sm leading-6 font-medium text-gray-400">{this.props.title}</h3>
              <div className="relative w-auto pl-1 flex-initial text-xs rounded-md p-1 ">
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
            </div>

            <div className="mt-1">
              <div className="flex flex-wrap space-x-2 items-center pr-3">
                <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black">{this.toFixed(this.props.total)}</p>
                {this.props.showIndicator === "true" ? (
                  <div className={"relative w-auto pl-1 flex flex-row items-center text-xs " + (delta >= 0 ? "text-green-800 bg-green-200" : "text-red-800 bg-red-200") + " rounded-md p-1 "}>
                    <div className="text-base font-bold">{(delta >= 0 ? "+" : "-") + this.toFixed(delta)}</div>
                    {delta >= 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex w-full text-s">
              <div className="flex w-full">
                <div className="flex-1 pr-3 text-left font-semibold">Total</div>
                <div className="flex-1 px-3 text-right">{this.toFixed(this.props.total)}</div>
              </div>
            </div>
            <div className="flex w-full text-s">
              <div className="flex w-full">
                <div className="flex-1 pr-3 text-left font-semibold">Staked</div>
                <div className="flex-1 px-3 text-right">{this.toFixed(this.props.staked)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoTile;
