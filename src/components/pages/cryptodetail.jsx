import React, {Component} from 'react';
import HistoricLineChartCrypto from '../charts/historiclinechartcrypto';
import {useParams} from 'react-router-dom';
import CryptoTransactionTableLine from '../table/cryptotransactiontableline';
const {ipcRenderer} = window.require('electron');
import PropTypes from 'prop-types';

export function withRouter(Children) {
  return function retWithRouter(props) {
    const match = {params: useParams()};
    return <Children {...props} match={match} />;
  };
}

class CryptoDetail extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  state = {
    name: '',
    balances: [],
    account: {},
    accountId: 0,
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('list-accounts-reply');
    ipcRenderer.removeAllListeners('query-account-reply');
    ipcRenderer.removeAllListeners('query-account-error');
  }

  componentDidMount() {
    this.setState({accountId: this.props.match.params.id});

    ipcRenderer.on('list-accounts-reply', (event, arg) => {
      const accounts = arg;
      let account = null;
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].id == this.state.accountId) {
          account = accounts[i];
        }
      }

      if (!account) {
        return;
      }

      account = this.populateHistoricTimeLine(account);

      this.setState({
        balances: account.balances,
        account: account,
        name: account.name,
        chartData: {
          items: [
            {name: 'total', data: this.collectChartData(account, 'total')},
            {name: 'staked', data: this.collectChartData(account, 'staked')},
            {name: 'rewards', data: this.collectChartData(account, 'rewards')},
          ],
          type: 'total',
          timeinterval: 'daily',
        },
      });
    });

    ipcRenderer.on('query-account-reply', (event, arg) => {
      let account = this.state.account;
      if (account.id === arg.id) {
        account.total = arg.data.total;
        account.staked = arg.data.staked;
        account.rewards = arg.data.rewards;
        account.price = arg.data.price;
        account.isLoading = false;
        account.isError = false;
      }

      account = this.populateHistoricTimeLine(account);

      this.setState({
        balances: account.balances,
        account: account,
        name: account.name,
        chartData: {
          items: [
            {name: 'total', data: this.collectChartData(account, 'total')},
            {name: 'staked', data: this.collectChartData(account, 'staked')},
            {name: 'rewards', data: this.collectChartData(account, 'rewards')},
          ],
          type: 'total',
          timeinterval: 'daily',
        },
      });
    });

    ipcRenderer.on('query-account-error', (event, arg) => {});

    ipcRenderer.send('list-accounts', 'test');
  }

  collectChartData(account, prop) {
    const chartObj = {};
    for (const item in account.balances) {
      if (!chartObj[item]) {
        chartObj[item] = account.balances[item] ? account.balances[item][prop] : 0;
      } else {
        chartObj[item] += account.balances[item] ? account.balances[item][prop] : 0;
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
    const elem = accounts;
    const obj = {};
    const balances = accounts.balances;
    let minDate = this.getMinDate(balances);
    const todayDate = this.getTodayDate();
    let lastObj = null;
    while (minDate <= todayDate) {
      if (accounts.balances[minDate]) {
        lastObj = accounts.balances[minDate];
      }
      obj[minDate] = lastObj;
      const cursorDate = new Date(minDate);
      cursorDate.setDate(cursorDate.getDate() + 1);
      minDate = new Date(cursorDate.getTime() - cursorDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    }
    elem.balances = obj;
    return elem;
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
    ipcRenderer.send('query-account', this.state.account);
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

  iterateBalances(balances) {
    const balanceArr = [];
    for (const item in balances) {
      if (balances.hasOwnProperty(item)) {
        balances[item].date = item;
        balanceArr.push(balances[item]);
      }
    }
    return balanceArr
        .sort(function(l, u) {
          return l.date < u.date ? 1 : -1;
        })
        .map((item) => <CryptoTransactionTableLine key={item.id} date={item.date} staked={item.staked} rewards={item.rewards} total={item.total}></CryptoTransactionTableLine>);
  }

  render() {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-14 border-b font-bold text-4xl">
          <div>{this.state.name}</div>
        </div>
        <div className="flex flex-wrap space-x-2 items-center">
          <p className="relative w-full pr-4 max-w-full flex-grow flex-1 text-3xl font-bold text-black"></p>
          <div className="relative w-auto pl-1 flex-initial p-1 ">
            <div className="flex gap-2">
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
            <HistoricLineChartCrypto chartData={this.state.chartData}></HistoricLineChartCrypto>
          </div>
        </div>
        <div className="pt-4 pb-4">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th key="name" className="py-3 px-6 text-left">
                  Date
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
            <tbody className="text-gray-600 text-sm font-light">{this.iterateBalances(this.state.balances)}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(CryptoDetail);
