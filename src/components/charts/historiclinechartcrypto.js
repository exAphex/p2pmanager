import React from 'react';
import 'chartjs-adapter-moment';
import {Line} from 'react-chartjs-2';
import {toFixed} from '../../utils/utils';
import HistoricLineChart from './historiclinechart';

class HistoricLineChartCrypto extends HistoricLineChart {
  state = {
    chartData: {},
  };

  parseChartOption(data) {
    const options = {
      spanGaps: 1000 * 60 * 60 * 24 * 2,
      interaction: {
        axis: 'xy',
        mode: 'index',
        intersect: false,
      },
      animation: {
        duration: 0,
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += toFixed(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      responsive: true,
      radius: 0,
      scales: {
        x: {
          type: 'time',

          time: {
            // Luxon format string
            unit: 'day',
            stepSize: 1,
            tooltipFormat: 'DD.MM.YYYY',
          },
          ticks: {
            min: 0,
            max: 4,
            // For a category axis, the val is the index so the lookup via getLabelForValue is needed
          },
        },
        y: {
          ticks: {
            callback: function(value, index, values) {
              return value;
            },
          },
        },
      },
    };

    if (!data) {
      return options;
    }

    options.scales.x.time.unit = this.getIntervalChartOptionType(data.timeinterval);
    options.scales.x.time.tooltipFormat = this.getIntervalChartOptionTooltip(data.timeinterval);

    return options;
  }

  render() {
    return (
      <div>
        <Line data={this.parseChartData(this.props.chartData)} options={this.parseChartOption(this.props.chartData)} />
      </div>
    );
  }
}

export default HistoricLineChartCrypto;
