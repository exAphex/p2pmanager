import React, {Component} from 'react';
import {toEuro} from '../../utils/utils';
import PropTypes from 'prop-types';

class DeltaIndicator extends Component {
  static propTypes = {
    value: PropTypes.number.isRequired,
  };
  getRoundedNumber(num) {
    if (num != null && num != undefined) {
      return num.toFixed(2);
    } else {
      return 0;
    }
  }

  render() {
    return this.getRoundedNumber(this.props.value) != 0 ? (
      <div className={'relative w-auto pl-1 flex flex-row items-center text-xs ' + (this.props.value >= 0 ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200') + ' rounded-md '}>
        <div className="text-base text-xs font-bold">{(this.props.value >= 0 ? '+' : '') + toEuro(this.props.value)}</div>
      </div>
    ) : null;
  }
}

export default DeltaIndicator;
