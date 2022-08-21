import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import HistoricLineChart from "../charts/historiclinechart";
import { getCategoryByType } from "../../utils/utils";
import P2PTableLine from "../table/p2ptableline";
import P2PTotalLine from "../table/p2ptotalline";
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

  componentWillUnmount() {
    ipcRenderer.removeAllListeners("list-accounts-reply");
  }

  componentDidMount() {
    ipcRenderer.on("list-accounts-reply", (event, arg) => {
      let accounts = arg.filter(function (a) {
        return getCategoryByType(a.type) === "P2P";
      });
      for (let i = 0; i < accounts.length; i++) {
        const bal = this.getLatestBalance(accounts[i].balances);
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

    ipcRenderer.send("list-accounts", "test");
  }

  getTodayDate() {
    const today = new Date();
    const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    return minDate;
  }

  getMinDate(balances) {
    const today = new Date();
    let minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    for (const b in balances) {
      if (minDate > b) {
        minDate = b;
      }
    }
    return minDate;
  }

  populateHistoricTimeLine(accounts) {
    const accs = [];
    accounts.forEach((element) => {
      const elem = element;
      const obj = {};
      const balances = element.balances;
      let minDate = this.getMinDate(balances);
      const todayDate = this.getTodayDate();
      let lastObj = null;
      while (minDate <= todayDate) {
        if (element.balances[minDate]) {
          lastObj = element.balances[minDate];
        }
        obj[minDate] = lastObj;
        const cursorDate = new Date(minDate);
        cursorDate.setDate(cursorDate.getDate() + 1);
        minDate = new Date(cursorDate.getTime() - cursorDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      }
      elem.balances = obj;
      accs.push(element);
    });
    return accs;
  }

  collectChartData(accounts, prop) {
    const chartObj = {};
    for (let i = 0; i < accounts.length; i++) {
      for (const item in accounts[i].balances) {
        if (!chartObj[item]) {
          chartObj[item] = accounts[i].balances[item] ? accounts[i].balances[item][prop] : 0;
        } else {
          chartObj[item] += accounts[i].balances[item] ? accounts[i].balances[item][prop] : 0;
        }
      }
    }

    const chartArr = [];
    for (const chartItem in chartObj) {
      if (chartObj.hasOwnProperty(chartItem)) {
        chartArr.push({ time: chartItem, total: chartObj[chartItem] });
      }
    }

    return chartArr;
  }

  getLatestBalance(balances) {
    if (!balances) {
      return {};
    }
    let newestDate = "1970-01-01";
    let newestBalance = {};
    for (const i in balances) {
      if (newestDate <= i) {
        newestDate = i;
        newestBalance = balances[i];
      }
    }
    return newestBalance;
  }

  onRefreshAccounts() {
    let accounts = this.state.accounts;
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].isLoading = true;
      accounts[i].isError = false;
      this.setState({ accounts: accounts });
      ipcRenderer
        .invoke("i_query_account", accounts[i])
        .then((arg) => {
          for (const acc of this.state.accounts) {
            if (acc.id == arg.id) {
              acc.total = arg.data.total;
              acc.invested = arg.data.invested;
              acc.uninvested = arg.data.uninvested;
              acc.loss = arg.data.loss;
              acc.profit = arg.data.profit;
              acc.isLoading = false;
              acc.isError = false;
              break;
            }
          }
          let tempAccounts = this.populateHistoricTimeLine(this.state.accounts);
          this.setState({
            accounts: tempAccounts,
            chartData: {
              items: [
                { name: "total", data: this.collectChartData(tempAccounts, "total") },
                { name: "invested", data: this.collectChartData(tempAccounts, "invested") },
                { name: "uninvested", data: this.collectChartData(tempAccounts, "uninvested") },
                { name: "profit", data: this.collectChartData(tempAccounts, "profit") },
              ],
              type: "total",
              timeinterval: "daily",
            },
          });
        })
        .catch((arg) => {
          accounts[i].isLoading = false;
          accounts[i].isError = true;
          accounts[i].errorMessage = arg.error;
          this.setState({ accounts: accounts });
        });
    }
  }

  handleChangeType(evt) {
    const types = this.state.interval;
    for (let i = 0; i < types.length; i++) {
      if (types[i].name === evt.target.value) {
        this.setState({ selectedInterval: types[i].type });
        break;
      }
    }
    return "0";
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>P2P</div>
        </div>

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
                    <option key={item.name}>{item.name}</option>
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
        <div className="pt-4 pb-4">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-right">Invested</th>
                <th className="py-3 px-6 text-right">Uninvested</th>
                <th className="py-3 px-6 text-right">Loss</th>
                <th className="py-3 px-6 text-right">Profit</th>
                <th className="py-3 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm ">
              {this.state.accounts
                .sort(function (l, u) {
                  return l.total < u.total ? 1 : -1;
                })
                .map((item) => (
                  <P2PTableLine
                    key={item.id}
                    deltaOption={this.state.selectedInterval}
                    errorMessage={item.errorMessage}
                    isError={item.isError}
                    isLoading={item.isLoading}
                    balances={item.balances}
                    type={item.type}
                    name={item.name}
                    invested={item.invested}
                    uninvested={item.uninvested}
                    loss={item.loss}
                    profit={item.profit}
                    total={item.total}
                  ></P2PTableLine>
                ))}
              <P2PTotalLine deltaOption={this.state.selectedInterval} accounts={this.state.accounts}></P2PTotalLine>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default P2P;
