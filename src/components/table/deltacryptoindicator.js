import React from 'react';
import {toEuro, toFixed} from '../../utils/utils';
import DeltaIndicator from './deltaindicator';

class DeltaCryptoIndicator extends DeltaIndicator {
  render() {
    return this.props.value != 0 ? (
      <div className={'relative w-auto pl-1 flex flex-row items-center text-xs ' + (this.props.value >= 0 ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200') + ' rounded-md '}>
        <div className="text-base text-xs font-bold">{(this.props.value >= 0 ? '+' : '') + toFixed(this.props.value) + '(' + toEuro(this.props.value * this.props.price) + ')'}</div>
      </div>
    ) : null;
  }
}

export default DeltaCryptoIndicator;
