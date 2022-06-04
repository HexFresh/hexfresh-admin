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
import {getCountNotificationAction} from "../../redux/count-notification-slice";

export default function Topbar({openSidebar}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userProfile = useSelector(state => state.profile.profile);

  const countNotification = useSelector(state => state.countNotification.counter);

  const fetchUserProfile = async () => {
    dispatch(getUserProfileAction())
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
      dispatch(getCountNotificationAction())
    }
    fetchData();
  }, [dispatch])

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

  const handleProfile = () => {
    navigate(`/profile/${localStorage.getItem('userId')}`)
    handleClose();
  }

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
        <div className="notification" onBlur={onClose}>
          <Notifications open={openNotification}/>
          {countNotification.unseen > 0 && <div className="count-notification">{countNotification?.unseen}</div>}
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
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
    </Menu>
  </div>);
}
