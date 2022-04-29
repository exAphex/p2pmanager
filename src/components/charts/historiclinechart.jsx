import React, {Component} from 'react';
import moment from 'moment';
import 'chartjs-adapter-moment';
import {Line} from 'react-chartjs-2';
import PropTypes from 'prop-types';

class HistoricLineChart extends Component {
  static propTypes = {
    chartData: PropTypes.object.isRequired,
  };

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
                label += context.parsed.y.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                  minimumFractionDigits: 2,
                });
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
          },
        },
        y: {
          ticks: {
            callback: function(value, index, values) {
              return value + ' €';
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

  parseChartData(data) {
    if (!data) {
      return;
    }

    if (data.items && data.items.length > 0) {
      const colors = ['rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(204, 0, 0)',
        'rgb(255, 159, 64)'];
      let i = 0;
      const dataSets = data.items.map((n) => {
        const tmpData = [];
        n.data
            .sort((a, b) => (moment(a.time).isAfter(b.time) ? 1 : moment(a.time).isBefore(b.time) ? -1 : 0))
            .forEach((item) => {
              tmpData.push({x: moment(item.time).toDate(), y: item.total});
            });
        i++;

        const obj = {
          label: n.name,
          data: tmpData,
          spanGaps: !1,
          borderWidth: 2,
          pointRadius: 0,
          backgroundColor: colors[i],
          borderColor: colors[i],
        };
        return obj;
      });

      const obj = {
        datasets: dataSets,
      };
      return obj;
    }
  }

  getIntervalName(name) {
    switch (name) {
      case 'daily':
        return 'days';
      case 'monthly':
        return 'months';
      default:
        return 'years';
    }
  }

  getIntervalChartOptionType(name) {
    switch (name) {
      case 'daily':
        return 'day';
      case 'monthly':
        return 'month';
      default:
        return 'year';
    }
  }

  getIntervalChartOptionTooltip(name) {
    switch (name) {
      case 'daily':
        return 'DD.MM.YYYY';
      case 'monthly':
        return 'MM.YYYY';
      default:
        return 'YYYY';
    }
  }

  getMinDate(arr, intervalNameNative) {
    let minDate = moment();
    arr.forEach((n) => {
      n.transactions.forEach((trans) => {
        if (moment(trans.t) < minDate) {
          minDate = moment(trans.t);
        }
      });
    });
    return minDate.startOf(intervalNameNative);
  }

  render() {
    return (
      <div>
        <Line data={this.parseChartData(this.props.chartData)} options={this.parseChartOption(this.props.chartData)} />
      </div>
    );
  }
}

export default HistoricLineChart;
