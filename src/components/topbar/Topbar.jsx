import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './topbar.css';
import Notifications from '../notifications/Notifications';

export default function Topbar({ openSidebar }) {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="topbar">
      <div className="container">
        <div className="left">
          <MenuIcon
            onClick={() => openSidebar()}
            fontSize="large"
            className="menu"
          />
        </div>
        <div className="right">
          <div className="notification" tabIndex="1" onBlur={onClose}>
            <Notifications open={open} />
            <div className="count-noti">10</div>
            <div className="ground" onClick={() => setOpen(!open)}>
              <NotificationsIcon />
            </div>
          </div>
          <div className="avatar">
            <Avatar
              alt="Travis Howard"
              src="https://img.freepik.com/free-vector/businessman-character-avatar-icon-vector-illustration-design_24877-18271.jpg?size=338&ext=jpg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
