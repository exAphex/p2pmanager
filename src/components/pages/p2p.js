import React, { Component } from "react";
import Tile from "../tile/tile";
import "react-datepicker/dist/react-datepicker.css";
import HistoricLineChart from "../charts/historiclinechart";
import OverviewTile from "../tile/overviewtile";
import { getCategoryByType } from "../../utils/utils";
const { ipcRenderer } = window.require("electron");

class P2P extends Component {
  state = {
    accounts: [],
    timestamp: new Date(),
    chartData: {},
    selectedInterval: "0",
    interval: [
      { name: "Last 24 hours", type: "0" },
      { name: "Last week", type: "1" },
      { name: "Last month", type: "2" },
      { name: "Last year", type: "3" },
    ],
  };

  componentDidMount() {
    ipcRenderer.removeAllListeners("list-accounts-reply");
    ipcRenderer.removeAllListeners("query-account-reply");
    ipcRenderer.removeAllListeners("query-account-error");
    ipcRenderer.removeAllListeners("update-app");

    ipcRenderer.on("update-app", (event, arg) => {
      console.log(arg.version);
    });

    ipcRenderer.on("list-accounts-reply", (event, arg) => {
      var accounts = arg.filter(function (a) {
        return getCategoryByType(a.type) == "P2P";
      });
      for (var i = 0; i < accounts.length; i++) {
        var bal = this.getLatestBalance(accounts[i].balances);
        accounts[i].total = bal.total;
        accounts[i].invested = bal.invested;
        accounts[i].uninvested = bal.uninvested;
        accounts[i].loss = bal.loss;
        accounts[i].profit = bal.profit;
        accounts[i].isError = false;
      }

      accounts = this.populateHistoricTimeLine(accounts);

      this.setState({
        accounts: accounts,
        showNewAccountModal: false,
        showDeleteAccountModal: false,
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

      accounts = this.populateHistoricTimeLine(accounts);

      this.setState({
        accounts: accounts,
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

  populateHistoricTimeLine(accounts) {
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

  collectChartData(accounts, prop) {
    var chartObj = {};
    for (var i = 0; i < accounts.length; i++) {
      for (var item in accounts[i].balances) {
        if (!chartObj[item]) {
          chartObj[item] = accounts[i].balances[item] ? accounts[i].balances[item][prop] : 0;
        } else {
          chartObj[item] += accounts[i].balances[item] ? accounts[i].balances[item][prop] : 0;
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

  handleChangeType(evt) {
    var types = this.state.interval;
    for (var i = 0; i < types.length; i++) {
      if (types[i].name === evt.target.value) {
        this.setState({ selectedInterval: types[i].type });
        break;
      }
    }
    return "0";
  }

  render() {
    return (
      <div className="bg-white shadow-md rounded my-0">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>

        <div className="m dax-w-full mx-4 py-0 sm:mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-wrap space-x-2 items-center">
            <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
            <div className="relative w-auto pl-1 flex-initial p-1 ">
              <div className="flex gap-2">
                <select onChange={(evt) => this.handleChangeType(evt)} className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full">
                  {this.state.interval
                    .sort(function (l, u) {
                      return l.type > u.type ? 1 : -1;
                    })
                    .map((item) => (
                      <option>{item.name}</option>
                    ))}
                </select>
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
          </div>
          <div className="grid grid-cols-6">
            <div className="col-start-2 col-span-4">
              <HistoricLineChart chartData={this.state.chartData}></HistoricLineChart>
            </div>
          </div>

          <h2 className="pt-4 font-bold text-2xl">Current portfolio</h2>
          <OverviewTile deltaOption={this.state.selectedInterval} accounts={this.state.accounts}></OverviewTile>
          <div>
            {this.state.accounts
              .sort(function (l, u) {
                return l.name > u.name ? 1 : -1;
              })
              .map((item) => (
                <Tile
                  key={item.id}
                  balances={item.balances}
                  deltaOption={this.state.selectedInterval}
                  errorMessage={item.errorMessage}
                  isError={item.isError}
                  isLoading={item.isLoading}
                  total={item.total}
                  title={item.name}
                  showIndicator="true"
                  invested={item.invested}
                  uninvested={item.uninvested}
                  loss={item.loss}
                  profit={item.profit}
                ></Tile>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default P2P;
