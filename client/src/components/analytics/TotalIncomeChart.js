import React from "react";
import ReactApexChart from "react-apexcharts";

class TotalIncomeChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: props?.totalIncome,
        },
      ],
      options: {
        chart: {
          id: "chart2",
          type: "area",
          height: 230,
          foreColor: "#ccc",
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
        },
        colors: ["#00BAEC"],
        stroke: {
          width: 3,
          curve: "smooth",
        },
        grid: {
          borderColor: "#555",
          clipMarkers: false,
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          gradient: {
            enabled: true,
            opacityFrom: 0.55,
            opacityTo: 0,
          },
        },
        markers: {
          size: 0,
          colors: ["#000524"],
          strokeColor: "#00BAEC",
          strokeWidth: 3,
        },
        series: [
          {
            data: props?.totalIncome,
          },
        ],
        tooltip: {
          theme: "dark",
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return (
                val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                " lbp"
              );
            },
          },
          min: 0,
          tickAmount: 4,
        },
      },
      seriesLine: [
        {
          data: props?.totalIncome,
        },
      ],
      optionsLine: {
        chart: {
          id: "chart1",
          height: 130,
          type: "area",
          foreColor: "#ccc",
          brush: {
            target: "chart2",
            enabled: true,
          },
          selection: {
            enabled: true,
            xaxis: {
              // min: new Date("19 Jun 2017").getTime(),
              // max: new Date("14 Aug 2017").getTime(),
            },
            fill: {
              color: "#fff",
              opacity: 0.4,
            },
          },
        },
        colors: ["#FF0080"],
        series: [
          {
            data: props?.totalIncome,
          },
        ],
        stroke: {
          width: 2,
        },
        grid: {
          borderColor: "#444",
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return (
                val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                " lbp"
              );
            },
          },
          tickAmount: 2,
        },
      },
    };
  }

  render() {
    return (
      <div>
        <h5 className="mb-4">NinjaCo's total income in the last 30 days</h5>
        {this.state?.options?.series[0]?.data &&
        this.state?.options?.series[0]?.data?.length > 0 ? (
          <>
            <div id="chart-line2">
              <ReactApexChart
                className="apex-analytics"
                options={this.state.options}
                series={this.state.series}
                type="line"
                height={230}
              />
            </div>
            <div id="chart-line">
              <ReactApexChart
                className="apex-analytics"
                options={this.state.optionsLine}
                series={this.state.seriesLine}
                type="area"
                height={130}
              />
            </div>
          </>
        ) : (
          <>Oops! It appears that NinjaCo does not have any income lately!</>
        )}
      </div>
    );
  }
}

export default TotalIncomeChart;
