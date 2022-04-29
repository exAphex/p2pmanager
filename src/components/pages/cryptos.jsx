import React, {Component} from 'react';
import {getCategoryByType} from '../../utils/utils';
import HistoricLineChart from '../charts/historiclinechart';
import CryptoTableLine from '../table/cryptotableline';
import CryptoTotalLine from '../table/cryptototalline';
const {ipcRenderer} = window.require('electron');

class Cryptos extends Component {
  state = {
    accounts: [],
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
      let accounts = arg.filter(function(a) {
        return getCategoryByType(a.type) === 'CRYPTO';
      });
      for (let i = 0; i < accounts.length; i++) {
        const bal = this.getLatestBalance(accounts[i].balances);
        accounts[i].total = bal.total;
        accounts[i].staked = bal.staked;
        accounts[i].rewards = bal.rewards;
        accounts[i].price = bal.price;
        accounts[i].isError = false;
      }

      accounts = this.populateHistoricTimeLine(accounts);

      this.setState({
        accounts: accounts,

        chartData: {
          items: [
            {name: 'total', data: this.collectChartData(accounts, 'total')},
            {name: 'staked', data: this.collectChartData(accounts, 'staked')},
            {name: 'rewards', data: this.collectChartData(accounts, 'rewards')},
          ],
          type: 'total',
          timeinterval: 'daily',
        },
      });
    });

    ipcRenderer.on('query-account-reply', (event, arg) => {
      let accounts = this.state.accounts;
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id === arg.id) {
          accounts[i].total = arg.data.total;
          accounts[i].staked = arg.data.staked;
          accounts[i].rewards = arg.data.rewards;
          accounts[i].price = arg.data.price;
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
            {name: 'total', data: this.collectChartData(accounts, 'total')},
            {name: 'staked', data: this.collectChartData(accounts, 'staked')},
            {name: 'rewards', data: this.collectChartData(accounts, 'rewards')},
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
  }

  collectChartData(accounts, prop) {
    const chartObj = {};
    for (let i = 0; i < accounts.length; i++) {
      for (const item in accounts[i].balances) {
        if (!chartObj[item]) {
          chartObj[item] = accounts[i].balances[item] ? accounts[i].balances[item][prop] * (accounts[i].balances[item]['price'] ? accounts[i].balances[item]['price'] : 0) : 0;
        } else {
          chartObj[item] += accounts[i].balances[item] ? accounts[i].balances[item][prop] * (accounts[i].balances[item]['price'] ? accounts[i].balances[item]['price'] : 0) : 0;
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
        minDate = new Date(cursorDate.getTime() - cursorDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      }
      elem.balances = obj;
      accs.push(element);
    });
    return accs;
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

  onRefreshAccounts() {
    const accounts = this.state.accounts;
    for (let i = 0; i < accounts.length; i++) {
      accounts[i].isLoading = true;
      ipcRenderer.send('query-account', accounts[i]);
    }
    this.setState({accounts: accounts});
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
          <div>Cryptos</div>
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
                <th key="staked" className="py-3 px-6 text-right">
                  Staked
                </th>
                <th key="rewards" className="py-3 px-6 text-right">
                  Unclaimed rewards
                </th>
                <th key="total" className="py-3 px-6 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {this.state.accounts
                  .sort(function(l, u) {
                    return l.total * l.price < u.total * u.price ? 1 : -1;
                  })
                  .map((item) => (
                    <CryptoTableLine
                      key={item.id}
                      id={item.id}
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
                    ></CryptoTableLine>
                  ))}
              <CryptoTotalLine deltaOption={this.state.selectedInterval} accounts={this.state.accounts}></CryptoTotalLine>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Cryptos;
