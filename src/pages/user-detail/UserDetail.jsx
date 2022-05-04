import React, { useEffect, useState } from 'react';
import './user-detail.css';
import { Link, useParams } from 'react-router-dom';
import { createNewEmptyUserProfile, getUserAccountById, getUserProfileById } from '../../api/user';
import { CircularProgress } from '@mui/material';
import { Breadcrumb, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

export default function UserDetail() {
  const [loading, setLoading] = useState(false);
  const [userAccount, setUserAccount] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const { userId } = useParams();

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
                  <img
                    src="https://bigdata-vn.com/wp-content/uploads/2021/10/Hinh-anh-ngau-dep-nhat-lam-avatar-Facebook-Zalo.jpg"
                    alt="avt"
                  />
                  <Button className="edit-btn" icon={<EditOutlined />} shape="circle" />
                </div>
                <div className="card-body__right">
                  <div className="card-body__right__name">
                    {userProfile.firstName} {userProfile.lastName || 'Minh Cuong Ha'}
                  </div>
                  <div className="card-body__right__email">{userAccount?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
