import React from "react";
import ReactApexChart from "react-apexcharts";

class BranchesIncome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: props?.branchesIncome?.seriesData,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bar",
          foreColor: "#ccc",
          toolbar: {
            autoSelected: "pan",
            show: false,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        tooltip: {
          theme: "dark",
        },
        xaxis: {
          categories: props?.branchesIncome?.xAxisCategories,
          colors: "#fff",
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      },
    };
  }

  render() {
    return (
      <div>
        <h5 className="mb-4">NinjaCo's branches comparison of last 30 days income</h5>
        <ReactApexChart
          className="apex mb-5"
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default BranchesIncome;