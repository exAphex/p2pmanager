import React, { Component } from "react";
import moment from "moment";
import "chartjs-adapter-moment";
import { Line } from "react-chartjs-2";

const footer = (tooltipItems) => {
  let sum = 0;
  tooltipItems.forEach(function (tooltipItem) {
    sum += tooltipItem.parsed.y;
  });
  return (
    "Sum: " +
    sum.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    })
  );
};

class HistoricLineChart extends Component {
  state = {
    chartData: {},
  };

  parseChartOption(data) {
    var options = {
      spanGaps: 1000 * 60 * 60 * 24 * 2,
      interaction: {
        axis: "xy",
        mode: "index",
        intersect: false,
      },
      plugins: {
        tooltip: {
          callbacks: {
            footer: footer,
          },
        },
      },
      responsive: true,
      radius: 0,
      scales: {
        x: {
          type: "time",

          time: {
            // Luxon format string
            unit: "day",
            stepSize: 1,
            tooltipFormat: "DD.MM.YYYY",
          },
          ticks: {
            min: 0,
            max: 4,
            // For a category axis, the val is the index so the lookup via getLabelForValue is needed
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
      var colors = ["rgb(255, 99, 132)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(204, 0, 0)", "rgb(255, 159, 64)"];
      var i = 0;
      var dataSets = data.items.map((n) => {
        var tmpData = [];
        n.data
          .sort((a, b) => (moment(a.time).isAfter(b.time) ? 1 : moment(a.time).isBefore(b.time) ? -1 : 0))
          .forEach((item) => {
            tmpData.push({ x: moment(item.time).toDate(), y: item.total });
          });
        i++;

        let obj = { label: n.name, data: tmpData, spanGaps: !1, borderWidth: 2, pointRadius: 0, backgroundColor: colors[i], borderColor: colors[i] };
        return obj;
      });

      let obj = {
        datasets: dataSets,
      };
      return obj;
    }
  }

  getIntervalName(name) {
    switch (name) {
      case "daily":
        return "days";
      case "monthly":
        return "months";
      default:
        return "years";
    }
  }

  getIntervalChartOptionType(name) {
    switch (name) {
      case "daily":
        return "day";
      case "monthly":
        return "month";
      default:
        return "year";
    }
  }

  getIntervalChartOptionTooltip(name) {
    switch (name) {
      case "daily":
        return "DD.MM.YYYY";
      case "monthly":
        return "MM.YYYY";
      default:
        return "YYYY";
    }
  }

  getMinDate(arr, intervalNameNative) {
    var minDate = moment();
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