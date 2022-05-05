/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import './user-detail.css';
import { Link, useParams } from 'react-router-dom';
import { createNewEmptyUserProfile, getUserAccountById, getUserProfileById } from '../../api/user';
import { CircularProgress } from '@mui/material';
import { Breadcrumb, Button, message } from 'antd';
import { UserOutlined, EditOutlined, MessageFilled } from '@ant-design/icons';
import axios from 'axios';

export default function UserDetail() {
  const [loading, setLoading] = useState(false);
  const [userAccount, setUserAccount] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const { userId } = useParams();
  const refInput = useRef(null);

  console.log({ userAccount, userProfile });

  const fetchUserAccount = async () => {
    const result = await getUserAccountById(userId);
    setUserAccount(result);
  };

  const fetchUserProfile = async () => {
    const result = await getUserProfileById(userId);
    if (result === undefined) {
      await createNewEmptyUserProfile(userId);
      await fetchUserProfile();
    } else {
      setUserProfile(result);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserAccount();
      await fetchUserProfile();
      setLoading(false);
    };
    fetchData();
  }, []);

  const uploadNewAvatar = async (file) => {
    if (file) {
      message.loading('Uploading...').then(async () => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'qk9dvfij');
        const res = await axios.post(`https://api.cloudinary.com/v1_1/hexfresh/image/upload`, data);
        if (res) {
          message.success('Uploaded!', 0.5);
          setUserProfile({ ...userProfile, avatar: res.data.secure_url });
        }
      });
    }
  };

  return (
    <div className="user-detail">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="user-detail__container">
          <div className="page-name">Profile</div>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/users">
                <UserOutlined />
                <span>List User</span>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Profile</Breadcrumb.Item>
          </Breadcrumb>
          <div className="card-body">
            <div className="cover-img">
              <div className="card__infor">
                <div className="avatar">
                  <img src={userProfile?.avatar || 'https://cdn-icons-png.flaticon.com/512/21/21104.png'} alt="avt" />
                  <Button
                    onClick={() => {
                      refInput.current?.click();
                    }}
                    className="edit-btn"
                    icon={<EditOutlined />}
                    shape="circle"
                  >
                    <input
                      ref={refInput}
                      style={{ display: 'none' }}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        if (event.target.files) {
                          uploadNewAvatar(event.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                </div>
                <div className="card-body__right">
                  <div className="card-body__right__name">
                    {userProfile.firstName} {userProfile.lastName || 'Minh Cuong Ha'}
                  </div>
                  <div className="card-body__right__email">{userAccount?.email}</div>
                </div>
              </div>
              <div>
                <Button className="message-btn" icon={<MessageFilled />}>
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
