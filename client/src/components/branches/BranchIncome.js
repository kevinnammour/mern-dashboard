import React from "react";
import ReactApexChart from "react-apexcharts";

class BrancheIncome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: props?.branchIncome?.seriesData,
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
          categories: props?.branchIncome?.xAxisCategories,
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
      <div className="mt-5">
        <h5 className="mb-4">
          Branch's income (in lbp) during the last 6 months
        </h5>
        {this.state.series.data && this.state.options.data.length > 0 ? (
          <>
            <ReactApexChart
              className="apex"
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={350}
            />
          </>
        ) : (
          <>Oops! It appears that this branch does not have any income lately!</>
        )}
      </div>
    );
  }
}

export default BrancheIncome;
