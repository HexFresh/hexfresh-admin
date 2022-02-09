import React from 'react';
import './dashboard.css';
import LineChart from '../../components/line-chart/LineChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import GroupIcon from '@mui/icons-material/Group';
import PercentIcon from '@mui/icons-material/Percent';
import StatusCard from '../../components/status-card/StatusCard';
import { Grid } from '@mui/material';

const cardData = [
  {
    id: 1,
    name: 'Mentors',
    number: '12345',
    icon: <BarChartIcon />,
  },
  {
    id: 2,
    name: 'Freshers',
    number: '12345',
    icon: <PieChartIcon />,
  },
  {
    id: 3,
    name: 'New Freshers',
    number: '12345',
    icon: <GroupIcon />,
  },
  {
    id: 4,
    name: 'Old Freshers',
    number: '12345',
    icon: <PercentIcon />,
  },
];

const chartOptions = {
  series: [
    {
      name: 'New Freshers',
      data: [40, 70, 20, 90, 36, 80, 30, 91, 60, 70, 50, 60],
    },
    {
      name: 'Old Freshers',
      data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10, 15, 20],
    },
  ],
  options: {
    color: ['#6ab04c', '#2980b9'],
    chart: {
      background: 'transparent',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    legend: {
      position: 'top',
    },
    grid: {
      show: true,
    },
  },
};

export default function Dashboard() {
  document.title = 'Dashboard';
  return (
    <div className="dashboard">
      <div className="container">
        <div className="page-name">Dashboard</div>
        <div className="cards">
          <Grid container spacing={2} alignItems="stretch">
            {cardData.map((card) => {
              return (
                <Grid key={card.id} item xs={12} sm={6} lg={3}>
                  <StatusCard card={card}></StatusCard>
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div className="chart">
          <LineChart chartOptions={chartOptions} />
        </div>
      </div>
    </div>
  );
}
