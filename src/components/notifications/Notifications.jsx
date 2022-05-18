import React, {useEffect} from 'react';
import './notifications.css';
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import {getNotificationsAction} from "../../redux/notification/notification-actions";

export default function Notifications({open}) {
  const active = open === true ? 'active' : '';
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification);

  const fetchNotifications = async () => {
    dispatch(getNotificationsAction());
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
    };
    fetchData();
  }, []);

  return (
    <div className={`notifications ${active}`}>
      {notifications.map((notification) => {
        // const getUserProfile = async () => {
        //   const result = await getUserProfileById(notification.userId);
        //   return result;
        // };
        // const userProfile = getUserProfile();
        // console.log({ userProfile });
        return (
          <div key={notification._id} className="notification-item">
            <div className="notification-item__left">
              <img
                className="avt"
                src="https://phunugioi.com/wp-content/uploads/2020/10/anh-dai-dien-avt-anime-1.jpg"
                alt="avt"
              />
            </div>
            <div className="notification-item__right">
              <div className="notification-item__right__title">{notification.title}</div>
              <div className="notification-item__right__body">{notification.body}</div>
              <div className="notification-item__right__date">{moment(notification.createdAt).fromNow()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
