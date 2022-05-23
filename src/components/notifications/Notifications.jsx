import React, {useEffect, useState} from 'react';
import './notifications.css';
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import {getNotificationsAction} from "../../redux/notification/notification-actions";
import {Button, Input, Modal} from "antd";
import {getNotification} from "../../api/notification";

export default function Notifications({open}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
          <div key={notification._id} className="notification-item"
               onClick={async () => {
                 setSelectedNotification(notification);
                 showModal();
               }}>
            <div className="notification-item__left">
              <img
                className="avt"
                src="https://phunugioi.com/wp-content/uploads/2020/10/anh-dai-dien-avt-anime-1.jpg"
                alt="avt"
              />
            </div>
            <div className="notification-item__right">
              <div className="notification-item__right__title">{notification.title}</div>
              <div className="notification-item__right__date">{moment(notification.createdAt).fromNow()}</div>
            </div>
          </div>
        );
      })}
      <Modal
        className="modal"
        title={selectedNotification?.title}
        visible={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleCancel}>
            Ok
          </Button>,
        ]}
      >
        <div className="detail-notification">
          <div className="field">
            <label>Content:</label>
            <span>{selectedNotification?.body}</span>
          </div>
          <div className="field">
            <label>From:</label>
            <span>{"Admin"}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
