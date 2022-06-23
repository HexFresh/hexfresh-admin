import React, {useEffect} from 'react';
import './dashboard.css';
import LineChart from '../../components/line-chart/LineChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import GroupIcon from '@mui/icons-material/Group';
import PercentIcon from '@mui/icons-material/Percent';
import StatusCard from '../../components/status-card/StatusCard';
import {CircularProgress, Grid} from '@mui/material';
import DonutChart from "../../components/donut-chart/DonutChart";
import {getStat} from "../../api/stat";
import {useNavigate} from "react-router-dom";


const chartOptions = {
  series: [{
    name: 'New Freshers', data: [40, 70, 20, 90, 36, 80, 30, 91, 60, 70, 50, 60],
  }, {
    name: 'Old Freshers', data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10, 15, 20],
  },], options: {
    color: ['#6ab04c', '#2980b9'], chart: {
      background: 'transparent',
    }, dataLabels: {
      enabled: false,
    }, stroke: {
      curve: 'smooth',
    }, xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',],
    }, legend: {
      position: 'top',
    }, grid: {
      show: true,
    },
  },
};

const options = {
  title: "Number of freshers of each program", pieHole: 0.8, is3D: false, pieSliceText: "none", pieStartAngle: 100
};

export default function Dashboard() {
  document.title = 'Dashboard';
  const navigate = useNavigate();
  const [stat, setStat] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const cardData = [{
    id: 1, name: 'New Freshers last 24h', number: stat?.newFreshersLast24Hours, icon: <BarChartIcon/>,
  }, {
    id: 2, name: 'New Freshers last 30 days', number: stat?.newFreshersLast30Days, icon: <PieChartIcon/>,
  }, {
    id: 3, name: 'Total Freshers', number: stat?.totalFreshers, icon: <GroupIcon/>,
  },];

  const fetchStat = async () => {
    const res = await getStat();
    console.log(res);
    setStat(res);
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchStat()]);
      setLoading(false);
    }
    fetchData()
  }, [])

  const donutData = (stat) => {
    if (stat) {
      const result = [["Program", "Fresher Count"]];
      stat.freshersInProgramRatio.map((item) => {
        result.push([item.title, item.total]);
      })
      console.log(result);
      return result;
    }
  }

  return (<div className="dashboard">
    {loading ? (<CircularProgress className={"circular-progress"}/>) : (<div className="container">
      <div className="page-name">Dashboard</div>
      <div className="cards">
        <Grid container spacing={2} alignItems="stretch">
          {cardData.map((card) => {
            return (<Grid key={card.id} item xs={12} sm={6} lg={4}>
              <StatusCard card={card}></StatusCard>
            </Grid>);
          })}
        </Grid>
      </div>
      <div className="chart" onClick={() => navigate('/programs')}>
        <DonutChart options={options} data={donutData(stat)}/>
      </div>
    </div>)}
  </div>);
}
