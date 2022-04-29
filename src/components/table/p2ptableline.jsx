import React from 'react';
import {toEuro, getIconByAccountType, getSafeNumber} from '../../utils/utils';
import DeltaIndicator from './deltaindicator';
import LoadingSpin from 'react-loading-spin';
import TableLine from './tableline';

class P2PTableLine extends TableLine {
  render() {
    const deltaDay = this.getDeltaDay(this.props.deltaOption);
    const deltaInvested = getSafeNumber(this.props.invested) - this.getDeltaDayValue(this.props.balances, deltaDay, 'invested');
    const deltaUninvested = getSafeNumber(this.props.uninvested) - this.getDeltaDayValue(this.props.balances, deltaDay, 'uninvested');
    const deltaLoss = getSafeNumber(this.props.loss) - this.getDeltaDayValue(this.props.balances, deltaDay, 'loss');
    const deltaProfit = getSafeNumber(this.props.profit) - this.getDeltaDayValue(this.props.balances, deltaDay, 'profit');
    const deltaTotal = getSafeNumber(this.props.total) - this.getDeltaDayValue(this.props.balances, deltaDay, 'total');
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <div className="flex">
            <div className="mr-2">{getIconByAccountType(this.props.type)}</div>
            <span className="font-medium">{this.props.name}</span>
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
            <span>{toEuro(this.props.invested)}</span>
            <DeltaIndicator value={deltaInvested}></DeltaIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.uninvested)}</span>
            <DeltaIndicator value={deltaUninvested}></DeltaIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.loss)}</span>
            <DeltaIndicator value={deltaLoss}></DeltaIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toEuro(this.props.profit)}</span>
            <DeltaIndicator value={deltaProfit}></DeltaIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span className="font-bold">{toEuro(this.props.total)}</span>
            <DeltaIndicator value={deltaTotal}></DeltaIndicator>
          </div>
        </td>
      </tr>
    );
  }
}

export default P2PTableLine;
