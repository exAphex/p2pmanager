import React, {Component} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import HistoricLineChart from '../charts/historiclinechart';
import {getCategoryByType} from '../../utils/utils';
import OverviewTableLine from '../table/overviewtableline';
import OverviewTotalLine from '../table/overviewtotalline';

const {ipcRenderer} = window.require('electron');

class Home extends Component {
  state = {
    accounts: [],
    accAccounts: [],
    timestamp: new Date(),
    chartData: {},
    selectedInterval: '0',
    interval: [
      {name: 'Last 24 hours', type: '0'},
      {name: 'Last week', type: '1'},
      {name: 'Last month', type: '2'},
      {name: 'Last year', type: '3'},
    ],
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('list-accounts-reply');
    ipcRenderer.removeAllListeners('query-account-reply');
    ipcRenderer.removeAllListeners('query-account-error');
  }

  componentDidMount() {
    ipcRenderer.on('list-accounts-reply', (event, arg) => {
      const accounts = arg;
      let retAccounts = [
        {name: 'P2P', isError: false, total: 0, balances: {}, type: 'Bondster'},
        {name: 'Cryptos', isError: false, total: 0, balances: {}, type: 'KAVA', price: 1},
      ];
      for (let i = 0; i < accounts.length; i++) {
        let index = 0;
        const bal = this.getLatestBalance(accounts[i].balances);

        if (getCategoryByType(accounts[i].type) === 'CRYPTO') {
          index = 1;
          retAccounts[index].total += bal.total * (bal.price ? bal.price : 0);
        } else {
          index = 0;
          retAccounts[index].total += bal.total;
        }

        for (const key in accounts[i].balances) {
          if (accounts[i].balances.hasOwnProperty(key)) {
            if (!retAccounts[index].balances[key]) {
              retAccounts[index].balances[key] = {total: 0};
            }
            if (getCategoryByType(accounts[i].type) === 'CRYPTO') {
              retAccounts[index].balances[key].total += accounts[i].balances[key].total ? accounts[i].balances[key].total * (accounts[i].balances[key].price ? accounts[i].balances[key].price : 0) : 0;
              retAccounts[index].balances[key].price = 1;
            } else {
              retAccounts[index].balances[key].total += accounts[i].balances[key].total ? accounts[i].balances[key].total : 0;
            }
          }
        }
      }

      retAccounts = this.populateHistoricTimeLine(retAccounts);

      this.setState({
        accounts: accounts,
        accAccounts: retAccounts,
        showNewAccountModal: false,
        showDeleteAccountModal: false,
        chartData: {
          items: [
            {name: 'total', data: this.collectChartData(retAccounts, 'total')},
            {name: 'P2P', data: this.collectAccChartData(retAccounts[0].type, retAccounts[0].balances, 'total')},
            {name: 'Cryptos', data: this.collectAccChartData(retAccounts[1].type, retAccounts[1].balances, 'total')},
          ],
          type: 'total',
          timeinterval: 'daily',
        },
      });
    });

    ipcRenderer.on('query-account-reply', (event, arg) => {
      const accounts = this.state.accounts;
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id === arg.id) {
          accounts[i].total = arg.data.total;
          accounts[i].isLoading = false;
          accounts[i].isError = false;
          break;
        }
      }

      let retAccounts = [
        {name: 'P2P', isError: false, total: 0, balances: {}, type: 'Bondster'},
        {name: 'Cryptos', isError: false, total: 0, balances: {}, type: 'KAVA', price: 1},
      ];
      for (let i = 0; i < accounts.length; i++) {
        let index = 0;
        const bal = this.getLatestBalance(accounts[i].balances);

        if (getCategoryByType(accounts[i].type) === 'CRYPTO') {
          index = 1;
          retAccounts[index].total += bal.total * (bal.price ? bal.price : 0);
        } else {
          index = 0;
          retAccounts[index].total += bal.total;
        }

        for (const key in accounts[i].balances) {
          if (accounts[i].balances.hasOwnProperty(key)) {
            if (!retAccounts[index].balances[key]) {
              retAccounts[index].balances[key] = {total: 0};
            }
            if (getCategoryByType(accounts[i].type) === 'CRYPTO') {
              retAccounts[index].balances[key].total += accounts[i].balances[key].total ? accounts[i].balances[key].total * (accounts[i].balances[key].price ? accounts[i].balances[key].price : 0) : 0;
              retAccounts[index].balances[key].price = 1;
            } else {
              retAccounts[index].balances[key].total += accounts[i].balances[key].total ? accounts[i].balances[key].total : 0;
            }
          }
        }
      }

      retAccounts = this.populateHistoricTimeLine(retAccounts);

      this.setState({
        accounts: accounts,
        accAccounts: retAccounts,
        showNewAccountModal: false,
        showDeleteAccountModal: false,
        chartData: {
          items: [
            {name: 'total', data: this.collectChartData(retAccounts, 'total')},
            {name: 'P2P', data: this.collectAccChartData(retAccounts[0].type, retAccounts[0].balances, 'total')},
            {name: 'Cryptos', data: this.collectAccChartData(retAccounts[1].type, retAccounts[1].balances, 'total')},
          ],
          type: 'total',
          timeinterval: 'daily',
        },
      });
    });

    ipcRenderer.on('query-account-error', (event, arg) => {
      const accounts = this.state.accounts;
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id === arg.message.id) {
          accounts[i].isLoading = false;
          accounts[i].isError = true;
          accounts[i].errorMessage = arg.error;
          break;
        }
      }
      this.setState({accounts: accounts});
    });

    ipcRenderer.send('list-accounts', 'test');
    ipcRenderer.send('update-app', '');
  }

  getTodayDate() {
    const today = new Date();
    const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    return minDate;
  }

  getMinDate(balances) {
    const today = new Date();
    let minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    for (const b in balances) {
      if (minDate > b) {
        minDate = b;
      }
    }
    return minDate;
  }

  populateHistoricTimeLine(accounts) {
    const accs = [];
    let minDate = this.getTodayDate;

    accounts.forEach((element) => {
      const balances = element.balances;
      if (this.getMinDate(balances) <= minDate) {
        minDate = this.getMinDate(balances);
      }
    });

    accounts.forEach((element) => {
      const elem = element;
      const obj = {};
      let tempMinDate = minDate;
      const todayDate = this.getTodayDate();
      let lastObj = {total: 0, price: 1};
      while (tempMinDate <= todayDate) {
        if (element.balances[tempMinDate]) {
          lastObj = element.balances[tempMinDate];
        }
        obj[tempMinDate] = lastObj;
        const cursorDate = new Date(tempMinDate);
        cursorDate.setDate(cursorDate.getDate() + 1);
        tempMinDate = new Date(cursorDate.getTime() - cursorDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
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
        if (accounts[i].balances.hasOwnProperty(item)) {
          const balPop = accounts[i].balances[item][prop];
          if (!chartObj[item]) {
            chartObj[item] = accounts[i].balances[item] ? balPop : 0;
          } else {
            chartObj[item] += accounts[i].balances[item] ? balPop : 0;
          }
        }
      }
    }

    const chartArr = [];
    for (const chartItem in chartObj) {
      if (chartObj.hasOwnProperty(chartItem)) {
        chartArr.push({time: chartItem, total: chartObj[chartItem]});
      }
    }

    return chartArr;
  }

  collectAccChartData(type, balances, prop) {
    const chartArr = [];
    for (const item in balances) {
      if (balances.hasOwnProperty(item)) {
        const balPop = balances[item][prop];
        chartArr.push({time: item, total: balPop});
      }
    }
    return chartArr;
  }

  getLatestBalance(balances) {
    if (!balances) {
      return {};
    }
    let newestDate = '1970-01-01';
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
    const accounts = this.state.accounts;
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].isLoading = true;
      ipcRenderer.send('query-account', accounts[i]);
    }
    this.setState({accounts: accounts});
  }

  handleChangeType(evt) {
    const types = this.state.interval;
    for (let i = 0; i < types.length; i++) {
      if (types[i].name === evt.target.value) {
        this.setState({selectedInterval: types[i].type});
        break;
      }
    }
    return '0';
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>Home</div>
        </div>

        <div className="flex flex-wrap space-x-2 items-center">
          <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
          <div className="relative w-auto pl-1 flex-initial p-1 ">
            <div className="flex gap-2">
              <select onChange={(evt) => this.handleChangeType(evt)} className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full">
                {this.state.interval
                    .sort(function(l, u) {
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
                <th key="name" className="py-3 px-6 text-left">
                  Name
                </th>
                <th key="total" className="py-3 px-6 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {this.state.accAccounts
                  .sort(function(l, u) {
                    return l.total > u.total ? -1 : 1;
                  })
                  .map((item) => (
                    <OverviewTableLine
                      key={item.id}
                      deltaOption={this.state.selectedInterval}
                      errorMessage={item.errorMessage}
                      isError={item.isError}
                      isLoading={item.isLoading}
                      balances={item.balances}
                      type={item.type}
                      name={item.name}
                      staked={item.staked}
                      price={item.price}
                      rewards={item.rewards}
                      total={item.total}
                    ></OverviewTableLine>
                  ))}
              <OverviewTotalLine deltaOption={this.state.selectedInterval} accounts={this.state.accAccounts}></OverviewTotalLine>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
