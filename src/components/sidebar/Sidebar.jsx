import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../dummyData/menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import './sidebar.css';
import SidebarItem from './SidebarItem';
import logo from '../../assets/images/logo.png';

export default function Sidebar() {
  const [hide, setHide] = useState(true);

  const location = useLocation();

  const activeItem = routes.findIndex(
    (item) => item.route === location.pathname
  );

  return (
    <div className={hide ? 'sidebar hide' : 'sidebar'}>
      <div className="back-button">
        {hide ? (
          <MenuIcon
            fontSize="large"
            className="menu"
            onClick={() => setHide(!hide)}
          />
        ) : (
          <ArrowBackIcon fontSize="large" onClick={() => setHide(!hide)} />
        )}
      </div>
      <div className="container">
        <div className="logo">
          <img src={logo} alt="company logo" />
        </div>
        <div className="route">
          {routes.map((route, index) => (
            <Link className="link" key={index} to={route.route}>
              <SidebarItem
                route={route}
                active={index === activeItem}
                hide={hide}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
