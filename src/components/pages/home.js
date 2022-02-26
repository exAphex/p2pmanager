import React, { Component } from "react";
import Tile from "../tile/tile";
import "react-datepicker/dist/react-datepicker.css";
import HistoricLineChart from "../charts/historiclinechart";
const { ipcRenderer } = window.require("electron");

class Home extends Component {
  state = { accounts: [], timestamp: new Date(), chartData: {} };

  componentDidMount() {
    ipcRenderer.removeAllListeners("list-accounts-reply");
    ipcRenderer.removeAllListeners("query-account-reply");
    ipcRenderer.removeAllListeners("query-account-error");
    ipcRenderer.on("list-accounts-reply", (event, arg) => {
      var accounts = arg;
      for (var i = 0; i < accounts.length; i++) {
        var bal = this.getLatestBalance(accounts[i].balances);
        accounts[i].total = bal.total;
        accounts[i].invested = bal.invested;
        accounts[i].uninvested = bal.uninvested;
        accounts[i].loss = bal.loss;
        accounts[i].profit = bal.profit;
        accounts[i].isError = false;
      }
      this.setState({ accounts: arg, showNewAccountModal: false, showDeleteAccountModal: false });

      this.setState({
        chartData: {
          items: [
            { name: "total", data: this.collectChartData(accounts, "total") },
            { name: "invested", data: this.collectChartData(accounts, "invested") },
            { name: "uninvested", data: this.collectChartData(accounts, "uninvested") },
            { name: "profit", data: this.collectChartData(accounts, "profit") },
          ],
          type: "total",
          timeinterval: "daily",
        },
      });
    });

    ipcRenderer.on("query-account-reply", (event, arg) => {
      var accounts = this.state.accounts;
      for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].id === arg.id) {
          accounts[i].total = arg.data.total;
          accounts[i].invested = arg.data.invested;
          accounts[i].uninvested = arg.data.uninvested;
          accounts[i].loss = arg.data.loss;
          accounts[i].profit = arg.data.profit;
          accounts[i].isLoading = false;
          accounts[i].isError = false;
          break;
        }
      }
      this.setState({ accounts: accounts });

      this.setState({
        chartData: {
          items: [
            { name: "total", data: this.collectChartData(accounts, "total") },
            { name: "invested", data: this.collectChartData(accounts, "invested") },
            { name: "uninvested", data: this.collectChartData(accounts, "uninvested") },
            { name: "profit", data: this.collectChartData(accounts, "profit") },
          ],
          type: "total",
          timeinterval: "daily",
        },
      });
    });

    ipcRenderer.on("query-account-error", (event, arg) => {
      var accounts = this.state.accounts;
      for (var i = 0; i < accounts.length; i++) {
        if (accounts[i].id === arg.message.id) {
          accounts[i].isLoading = false;
          accounts[i].isError = true;
          accounts[i].errorMessage = arg.error;
          break;
        }
      }
      this.setState({ accounts: accounts });
    });

    ipcRenderer.send("list-accounts", "test");
  }

  collectChartData(accounts, prop) {
    var chartObj = {};
    for (var i = 0; i < accounts.length; i++) {
      for (var item in accounts[i].balances) {
        if (!chartObj[item]) {
          chartObj[item] = accounts[i].balances[item][prop];
        } else {
          chartObj[item] += accounts[i].balances[item][prop];
        }
      }
    }

    var chartArr = [];
    for (var chartItem in chartObj) {
      chartArr.push({ time: chartItem, total: chartObj[chartItem] });
    }

    return chartArr;
  }

  getLatestBalance(balances) {
    if (!balances) {
      return {};
    }
    var newestDate = "1970-01-01";
    var newestBalance = {};
    for (var i in balances) {
      if (newestDate <= i) {
        newestDate = i;
        newestBalance = balances[i];
      }
    }
    return newestBalance;
  }

  onRefreshAccounts() {
    var accounts = this.state.accounts;
    for (var i = 0; i < accounts.length; i++) {
      accounts[i].isLoading = true;
      ipcRenderer.send("query-account", accounts[i]);
    }
    this.setState({ accounts: accounts });
  }

  render() {
    return (
      <div className="bg-white shadow-md rounded my-0">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>
        <div className="max-w-full mx-4 py-0 sm:mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-wrap space-x-2 items-center">
            <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
            <div className="relative w-auto pl-1 flex-initial p-1 ">
              <div className="shadow rounded-lg flex mr-2">
                <button onClick={() => this.onRefreshAccounts()} type="button" className="rounded-lg inline-flex items-center bg-white hover:text-purple-500 focus:outline-none focus:shadow-outline text-gray-500 font-semibold py-2 px-2 md:px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden md:block ml-2">Refresh</span>
                </button>
              </div>
            </div>
          </div>
          <HistoricLineChart chartData={this.state.chartData}></HistoricLineChart>
          <h2 className="pt-4 font-bold text-2xl">Current portfolio</h2>

          <div className="sm:flex sm:space-x-4">
            {this.state.accounts
              .sort(function (l, u) {
                return l.name > u.name ? 1 : -1;
              })
              .map((item) => (
                <Tile key={item.id} errorMessage={item.errorMessage} isError={item.isError} isLoading={item.isLoading} total={item.total} title={item.name} showIndicator="true" invested={item.invested} uninvested={item.uninvested} loss={item.loss} profit={item.profit}></Tile>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
