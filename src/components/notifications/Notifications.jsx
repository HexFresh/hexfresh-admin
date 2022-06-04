import React, {useEffect, useState} from 'react';
import './notifications.css';
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal} from "antd";
import {getNotificationsAction} from "../../redux/notification/notification-slice";
import NotificationItem from "./NotificationItem";
import {getNotification} from "../../api/notification";
import {getCounter} from "../../redux/count-notification-slice";

export default function Notifications({open}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const active = open === true ? 'active' : '';
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification.notifications);

  const unseen = useSelector(state => state.countNotification.counter.unseen);

  const fetchNotifications = async () => {
    dispatch(getNotificationsAction())
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
    };
    fetchData();
  }, []);

  const handleNotificationItemClick = async (notification, userProfile) => {
    setSelectedNotification(notification);
    setSelectedUserProfile(userProfile);
    await getNotification(notification._id);
    dispatch(getCounter({
      unseen: unseen - 1
    }))
    showModal()
  }

  const showModal = () => {
    setIsModalVisible(true);
    fetchNotifications();
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
