import React, {useEffect, useState} from 'react';
import './notifications.css';
import {useDispatch, useSelector} from "react-redux";
import {Button, Modal} from "antd";
import {
  getAllNotification, getMoreNotification, getNotificationsAction
} from "../../redux/notification/notification-slice";
import NotificationItem from "./NotificationItem";
import {getNotification, getNotificationsService} from "../../api/notification";
import {getCounter} from "../../redux/count-notification-slice";
import {CircularProgress} from "@mui/material";

const nPerPage = 5;

export default function Notifications({open}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const active = open === true ? 'active' : '';
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notification.notifications);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const unseen = useSelector(state => state.countNotification.counter.unseen);
  const total = useSelector(state => state.countNotification.counter.total);

  const fetchNotifications = async (mess = "No") => {
    if (notifications.length === 0 || mess === "Yes") {
      setPage(1);
      const payload = {
        skip: (1 - 1) * nPerPage, limit: nPerPage
      }
      dispatch(getNotificationsAction(payload));
    } else {
      dispatch(getAllNotification(notifications))
    }
  };

  useEffect(() => {
    const fetchData = async () => {
    };
    fetchData();
  }, []);

  const handleNotificationItemClick = async (notification, userProfile) => {
    setSelectedNotification(notification);
    setSelectedUserProfile(userProfile);
    await getNotification(notification._id);
    dispatch(getCounter({
      total: total, unseen: unseen - 1
    }))
    await showModal()
  }

  const showModal = async () => {
    setIsModalVisible(true);
    await fetchNotifications("Yes");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handeLoadMoreNotifications = async () => {
    setLoading(true);
    setPage(page + 1);
    const payload = {
      skip: (page) * nPerPage, limit: nPerPage
    }
    const result = await getNotificationsService(payload);
    dispatch(getMoreNotification(result));
    setLoading(false);
  }

  return (<div className={`notifications ${active}`}>
    {notifications.map((notification) => (<NotificationItem key={notification._id} notification={notification}
                                                            notificationItemClick={handleNotificationItemClick}/>))}
    {loading && <CircularProgress className={"notification-circular-progress"}/>}
    {notifications.length < total &&
      <Button className="notification-load-more" onClick={handeLoadMoreNotifications}>Load more</Button>}
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
