import React from 'react';
import {toEuro} from '../../utils/utils';
import DeltaIndicator from './deltaindicator';
import TableLine from './tableline';

class CryptoTotalLine extends TableLine {
  render() {
    const overViewData = this.calculateAbsoluteProperty(this.props.accounts);
    const deltaDay = this.getDeltaDay(this.props.deltaOption);
    const deltaObj = this.getDeltaDayValueTotal(this.props.accounts, deltaDay);
    const absObj = this.getDeltaAbsoluteValue(deltaObj, overViewData);
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-100 bg-slate-200">
        <td className="py-3 px-6 whitespace-nowrap">
          <div className="flex">
            <span className="font-bold">Total</span>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span className="font-bold">{toEuro(overViewData.staked)}</span>
            <DeltaIndicator value={absObj.staked}></DeltaIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span className="font-bold">{toEuro(overViewData.rewards)}</span>
            <DeltaIndicator value={absObj.rewards}></DeltaIndicator>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span className="font-bold">{toEuro(overViewData.total)}</span>
            <DeltaIndicator value={absObj.total}></DeltaIndicator>
          </div>
        </td>
      </tr>
    );
  }
}

export default CryptoTotalLine;
