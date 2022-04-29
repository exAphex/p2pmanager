import React from 'react';
import {toFixed} from '../../utils/utils';
import TableLine from './tableline';

class CryptoTransactionTableLine extends TableLine {
  render() {
    return (
      <tr key={this.props.date} className="border-b border-gray-200 hover:bg-gray-100">
        <td className="py-3 px-6 whitespace-nowrap">
          <div className="flex">
            <span className="font-medium">{this.props.date}</span>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toFixed(this.props.staked)}</span>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span>{toFixed(this.props.rewards)}</span>
          </div>
        </td>
        <td className="py-3 px-6 text-right">
          <div className="grid grid-cols-1 justify-items-end">
            <span className="font-bold">{toFixed(this.props.total)}</span>
          </div>
        </td>
      </tr>
    );
  }
}

export default CryptoTransactionTableLine;
