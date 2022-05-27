import React, {useEffect, useState} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './topbar.css';
import Notifications from '../notifications/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useDispatch, useSelector} from 'react-redux';
import {signOut} from "../../redux/auth/auth-slice";
import {useNavigate} from "react-router-dom";
import {getUserProfileAction} from "../../redux/profile/profile-slice";

export default function Topbar({openSidebar}) {
  const [openNotification, setOpenNotification] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userProfile = useSelector(state => state.profile.profile);

  const fetchUserProfile = async () => {
    dispatch(getUserProfileAction())
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
    }
    fetchData();
  }, [])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClose = () => {
    setOpenNotification(false);
  };

  const handleLogout = () => {
    dispatch(signOut({navigate}));
    handleClose();
  };

  return (<div className="topbar">
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
          <Notifications open={openNotification}/>
          <div className="count-notification">10</div>
          <div className="ground" onClick={() => setOpenNotification(!openNotification)}>
            <NotificationsIcon/>
          </div>
        </div>

        <div className="avatar">
          <Avatar
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            src={userProfile.avatar}
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
  </div>);
}
