import React, { useEffect, useState } from 'react';
import './notifications.css';
import { getNotifications } from '../../api/notification';
import { getUserProfileById } from '../../api/userProfile';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export default function Notifications({ open }) {
  const active = open === true ? 'active' : '';
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const result = await getNotifications();
    console.log({ result });
    setNotifications(result || []);
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
              <div className="notification-item__right__date">{moment(notification.createdAt).format(dateFormat)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
