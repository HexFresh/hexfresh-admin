import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import GroupIcon from '@mui/icons-material/Group';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import './sidebar.css';
import SidebarItem from './SidebarItem';
import logo from '../../assets/images/logo.png';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BadgeIcon from '@mui/icons-material/Badge';

export default function Sidebar({open, openSidebar, closeSidebar}) {
  const location = useLocation();

  const userId = localStorage.getItem('userId');

  const routes = [{
    display_name: 'Programs', route: '/dashboard', icon: <DashboardIcon/>,
  }, {
    display_name: 'Mentors', route: '/programs', icon: <LoyaltyIcon/>,
  }, {
    display_name: 'Users', route: '/users', icon: <GroupIcon/>,
  }, {
    display_name: 'Badges', route: `/badges`, icon: <BadgeIcon/>,
  }, {
    display_name: 'Profile', route: `/profile/${userId}`, icon: <AssignmentIndIcon/>,
  },];

  const activeItem = routes.findIndex((item) => location.pathname.includes(item.route));

  return (<div className={open ? 'sidebar' : 'sidebar hide'}>
    <div className="back-button">
      {!open ? (<MenuIcon fontSize="large" className="menu" onClick={() => openSidebar()}/>) : (
        <ArrowBackIcon fontSize="large" onClick={() => closeSidebar()}/>)}
    </div>
    <div className="container">
      <div className="logo">
        <img src={logo} alt="company logo"/>
      </div>
      <div className="route">
        {routes.map((route, index) => (
          <Link onClick={() => closeSidebar()} className="link" key={index} to={route.route}>
            <SidebarItem route={route} active={index === activeItem} hide={!open}/>
          </Link>))}
      </div>
    </div>
  </div>);
}
