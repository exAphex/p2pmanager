import React, { Component } from "react";

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
  render() {
    return (
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-2">
        <div className="bg-white p-5">
          <div className="">
            <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
              <h3 className="text-sm leading-6 font-medium text-gray-400">{this.props.title}</h3>
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
      </div>
    );
  }
}

export default Tile;
