import React, {useEffect} from 'react';
import './dashboard.css';
import LineChart from '../../components/line-chart/LineChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import GroupIcon from '@mui/icons-material/Group';
import StatusCard from '../../components/status-card/StatusCard';
import {CircularProgress, Grid} from '@mui/material';
import DonutChart from "../../components/donut-chart/DonutChart";
import {getStat} from "../../api/stat";
import {useNavigate} from "react-router-dom";
import moment from "moment";

const PieOptions = {
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
      stat.freshersInProgramRatio.forEach((item) => {
        result.push([item.title, item.total]);
      })

      console.log(result);
      return result;
    }
  }

  const options = {
    title: "New Freshers By Date", hAxis: {
      title: "Day",
    }, vAxis: {
      title: "Number of freshers", viewWindow: {
        min: 0,
      }, format: '0'
    }, series: {
      1: {curveType: "function"},
    },
  };

  const lineData = (stat) => {
    if (stat) {
      const result = [["Day", "Fresher"]];
      stat.newFreshersByDate.forEach((item) => {
        const date = moment(item.date).format('DD/MM');
        result.push([date, item.total]);
      })
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
      <div className={"chart"}>
        <LineChart options={options} data={lineData(stat)}/>
      </div>
      <div className="chart" onClick={() => navigate('/programs')}>
        <DonutChart options={PieOptions} data={donutData(stat)}/>
      </div>
    </div>)}
  </div>);
}
