import React from 'react';
import {toEuro, getSafeNumber} from '../../utils/utils';
import DeltaIndicator from './deltaindicator';
import TableLine from './tableline';

class OverviewTableLine extends TableLine {
  render() {
    const deltaDay = this.getDeltaDay(this.props.deltaOption);
    const deltaTotal = getSafeNumber(this.props.total) - this.getDeltaDayValue(this.props.balances, deltaDay, 'total');
    return (
      <tr key={this.props.name} className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <div className="flex">
            <span className="font-medium">{this.props.name}</span>
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

export default OverviewTableLine;
