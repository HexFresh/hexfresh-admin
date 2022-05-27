import React, {useEffect, useState} from 'react';
import './notifications.css';
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal} from "antd";
import {getNotificationsAction} from "../../redux/notification/notification-slice";
import NotificationItem from "./NotificationItem";

export default function Notifications({open}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const active = open === true ? 'active' : '';
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification.notifications);

  const fetchNotifications = async () => {
    dispatch(getNotificationsAction())
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
    };
    fetchData();
  }, []);

  const handleNotificationItemClick = (notification, userProfile) => {
    setSelectedNotification(notification);
    setSelectedUserProfile(userProfile);
    showModal()
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (<div className={`notifications ${active}`}>
    {notifications.map((notification) => (<NotificationItem key={notification._id} notification={notification}
                                                            notificationItemClick={handleNotificationItemClick}/>))}
    <Modal
      className="modal"
      title={selectedNotification?.title}
      visible={isModalVisible}
      onOk={handleCancel}
      onCancel={handleCancel}
      footer={[<Button key="submit" type="primary" onClick={handleCancel}>
        Ok
      </Button>,]}
    >
      <div className="detail-notification">
        <div className="field">
          <label>From:</label>
          <span>{selectedUserProfile?.firstName}</span>
        </div>
        <div className="field">
          <label>Content:</label>
          <span>{selectedNotification?.body}</span>
        </div>
      </div>
    </Modal>
  </div>);
}
