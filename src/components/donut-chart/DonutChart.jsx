import React from "react";
import Chart from "react-google-charts";

export default function DonutChart({options, data}) {
  return (<Chart
    chartType="PieChart"
    width="100%"
    height="400px"
    data={data}
    options={options}
  />);
}