import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './topbar.css';
import Notifications from '../notifications/Notifications';

export default function Topbar() {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="topbar">
      <div className="container">
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
  );
}
