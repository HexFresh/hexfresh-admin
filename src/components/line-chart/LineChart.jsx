import React from 'react';
import Chart from 'react-apexcharts';

export default function LineChart({ chartOptions }) {
  return (
    <Chart
      options={{
        ...chartOptions.options,
        theme: { mode: 'light' },
      }}
      series={chartOptions.series}
      type="line"
      height="350px"
    />
  );
}
