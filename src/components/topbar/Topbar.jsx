import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './topbar.css';
import Notifications from '../notifications/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { signOut } from '../../redux/auth/auth-actions';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ openSidebar }) {
  const [openNoti, setOpenNoti] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClose = () => {
    setOpenNoti(false);
  };

  const handleLogout = () => {
    dispatch(signOut(navigate));
    handleClose();
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
            <Notifications open={openNoti} />
            <div className="count-noti">10</div>
            <div className="ground" onClick={() => setOpenNoti(!openNoti)}>
              <NotificationsIcon />
            </div>
          </div>

          <div className="avatar">
            <Avatar
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              alt="Travis Howard"
              src="https://img.freepik.com/free-vector/businessman-character-avatar-icon-vector-illustration-design_24877-18271.jpg?size=338&ext=jpg"
            />
          </div>
        </div>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
