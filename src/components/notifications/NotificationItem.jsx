import moment from "moment";
import React, {useEffect, useState} from "react";
import {getUserProfileById} from "../../api/userProfile";
import Avatar from "@mui/material/Avatar";

export default function NotificationItem(props) {
  const [userProfile, setUserProfile] = useState({});

  const fetchUserProfile = async () => {
    const userProfile = await getUserProfileById(notification.from);
    setUserProfile(userProfile);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserProfile();
    }
    fetchData();
  }, [])

  const {notification, notificationItemClick} = props;

  return (<div onClick={() => notificationItemClick(notification, userProfile)} key={notification._id}
               className="notification-item">
    <div className="notification-item__left">
      <Avatar key={notification._id} src={userProfile.avatar}/>
    </div>
    <div className="notification-item__right">
      <div className="notification-item__right__title">{notification.title}</div>
      <div className="notification-item__right__date">{moment(notification.createdAt).fromNow()}</div>
    </div>
  </div>)
}