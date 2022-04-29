import React from 'react';
import {toEuro, toFixed, getIconByAccountType, getSafeNumber} from '../../utils/utils';
import LoadingSpin from 'react-loading-spin';
import DeltaCryptoIndicator from './deltacryptoindicator';
import TableLine from './tableline';
import {Link} from 'react-router-dom';

class CryptoTableLine extends TableLine {
  render() {
    const deltaDay = this.getDeltaDay(this.props.deltaOption);
    const deltaStaked = getSafeNumber(this.props.staked) - this.getDeltaDayValue(this.props.balances, deltaDay, 'staked');
    const deltaRewards = getSafeNumber(this.props.rewards) - this.getDeltaDayValue(this.props.balances, deltaDay, 'rewards');
    const deltaTotal = getSafeNumber(this.props.total) - this.getDeltaDayValue(this.props.balances, deltaDay, 'total');
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <div className="flex">
            <div className="mr-2">{getIconByAccountType(this.props.type)}</div>
            <Link className={'font-medium'} to={'/cryptodetail/' + this.props.id}>
              <span className="font-medium">{this.props.name}</span>
            </Link>

            {this.props.isLoading ? <LoadingSpin size="24px" /> : null}
            {this.props.isError ? (
              <div className="text-red-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>{this.formatError(this.props.errorMessage)}</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : null}
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toFixed(this.props.staked)}</span>
            <span>{toEuro(this.props.staked * this.props.price)}</span>
            <DeltaCryptoIndicator value={deltaStaked} price={this.props.price}></DeltaCryptoIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toFixed(this.props.rewards)}</span>
            <span>{toEuro(this.props.rewards * this.props.price)}</span>
            <DeltaCryptoIndicator value={deltaRewards} price={this.props.price}></DeltaCryptoIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span className="font-bold">{toFixed(this.props.total)}</span>
            <span className="font-bold">{toEuro(this.props.total * this.props.price)}</span>
            <DeltaCryptoIndicator value={deltaTotal} price={this.props.price}></DeltaCryptoIndicator>
          </div>
        </td>
      </tr>
    );
  }
}

export default CryptoTableLine;
