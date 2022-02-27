import React from "react";
import LoadingSpin from "react-loading-spin";

class Tile extends React.Component {
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
    return (
      <div className="inline-block w-full sm:w-1/2 sm:my-2 lg:w-1/3 p-2">
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
                <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black">{this.toCurrencyString(this.props.total)}</p>
                {this.props.showIndicator === "true" ? (
                  <div className={"relative w-auto pl-1 flex-initial text-xs " + (this.props.profit >= 0 ? "text-green-800 bg-green-200" : "text-red-800 bg-red-200") + " rounded-md p-1 "}>
                    {this.props.profit >= 0 ? (
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
                <div className="flex-1 pr-3 text-left font-semibold">Invested</div>
                <div className="flex-1 px-3 text-right" x-text="stockTicker.price.open.toFixed(3)">
                  {this.toCurrencyString(this.props.invested)}
                </div>
              </div>
            </div>
            <div className="flex w-full text-s">
              <div className="flex w-full">
                <div className="flex-1 pr-3 text-left font-semibold">Uninvested</div>
                <div className="flex-1 px-3 text-right" x-text="stockTicker.price.open.toFixed(3)">
                  {this.toCurrencyString(this.props.uninvested)}
                </div>
              </div>
            </div>
            <div className="flex w-full text-s">
              <div className="flex w-full">
                <div className="flex-1 pr-3 text-left font-semibold">Loss</div>
                <div className="flex-1 px-3 text-right" x-text="stockTicker.price.open.toFixed(3)">
                  {this.toCurrencyString(this.props.loss)}
                </div>
              </div>
            </div>
            <div className="flex w-full text-s">
              <div className="flex w-full">
                <div className="flex-1 pr-3 text-left font-semibold">Profit</div>
                <div className="flex-1 px-3 text-right" x-text="stockTicker.price.open.toFixed(3)">
                  {this.toCurrencyString(this.props.profit)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Tile;
