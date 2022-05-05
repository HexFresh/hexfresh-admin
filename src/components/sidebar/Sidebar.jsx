import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import GroupIcon from '@mui/icons-material/Group';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import './sidebar.css';
import SidebarItem from './SidebarItem';
import logo from '../../assets/images/logo.png';

export default function Sidebar({ open, openSidebar, closeSidebar }) {
  const location = useLocation();

  const userId = useSelector((state) => state.auth.id);

  const routes = [
    {
      display_name: 'Programs',
      route: '/programs',
      icon: <DashboardIcon />,
    },
    {
      display_name: 'Mentors',
      route: '/mentors',
      icon: <SupervisedUserCircleIcon />,
    },
    {
      display_name: 'Users',
      route: '/users',
      icon: <GroupIcon />,
    },
    {
      display_name: 'Your Profile',
      route: `/profile/${userId}`,
      icon: <GroupIcon />,
    },
  ];

  const activeItem = routes.findIndex((item) => item.route === location.pathname);

  return (
    <div className={open ? 'sidebar' : 'sidebar hide'}>
      <div className="back-button">
        {!open ? (
          <MenuIcon fontSize="large" className="menu" onClick={() => openSidebar()} />
        ) : (
          <ArrowBackIcon fontSize="large" onClick={() => closeSidebar()} />
        )}
      </div>
      <div className="container">
        <div className="logo">
          <img src={logo} alt="company logo" />
        </div>
        <div className="route">
          {routes.map((route, index) => (
            <Link onClick={() => closeSidebar()} className="link" key={index} to={route.route}>
              <SidebarItem route={route} active={index === activeItem} hide={!open} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
