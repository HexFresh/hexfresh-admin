/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import './user-detail.css';
import { Link, useParams } from 'react-router-dom';
import { createNewEmptyUserProfile, getUserAccountById, getUserProfileById, updateUserProfile } from '../../api/user';
import { CircularProgress } from '@mui/material';
import { Breadcrumb, Button, message, Input, DatePicker, Select } from 'antd';
import { UserOutlined, EditOutlined, MessageFilled } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const BASE_ADDRESS_API_URL = 'https://provinces.open-api.vn/api';

export default function UserDetail() {
  const [loading, setLoading] = useState(false);
  const [userAccount, setUserAccount] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [displayFirstName, setDisplayFirstName] = useState('');
  const [displayLastName, setDisplayLastName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const { userId } = useParams();
  const refInput = useRef(null);

  console.log({ selectedProvince, selectedDistrict, selectedWard });

  const fetchUserAccount = async () => {
    const result = await getUserAccountById(userId);
    setUserAccount(result);
    setDisplayEmail(result.email);
  };

  const fetchUserProfile = async () => {
    const result = await getUserProfileById(userId);
    if (result === undefined) {
      await createNewEmptyUserProfile(userId);
      await fetchUserProfile();
    } else {
      setUserProfile(result);
      setDisplayFirstName(result.firstName || '');
      setDisplayLastName(result.lastName || '');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserAccount();
      await fetchUserProfile();
      await fetchProvinces();
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

  const handleUpdateUserProfile = async () => {
    message.loading('Updating...').then(async () => {
      const newUserProfile = { ...userProfile };
      const result = await updateUserProfile(userId, newUserProfile);
      if (result) {
        message.success('Updated!', 0.5);
      }
    });
  };

  const onDateOfBirthChange = (date, dateString) => {
    setUserProfile({ ...userProfile, dateOfBirth: dateString });
  };

  const fetchProvinces = async () => {
    const rdata = await axios.get(`${BASE_ADDRESS_API_URL}/p/`);
    setProvinces(rdata.data);
  };

  const fetchDistricts = async (provinceCode) => {
    const rdata = await axios.get(`${BASE_ADDRESS_API_URL}/p/${provinceCode}`, { params: { depth: 2 } });
    setDistricts(rdata.data.districts || []);
  };
  const fetchWards = async (districtCode) => {
    const rdata = await axios.get(`${BASE_ADDRESS_API_URL}/d/${districtCode}`, { params: { depth: 2 } });
    setWards(rdata.data.wards || []);
  };

  const handleChangeProvince = async (value) => {
    setSelectedProvince(value);
    await fetchDistricts(value);
    setSelectedDistrict(null);
    setSelectedWard(null);
  };

  const handleChangeDistrict = async (value) => {
    setSelectedDistrict(value);
    await fetchWards(value);
    setSelectedWard(null);
  };

  const handleChangeWard = async (value) => {
    setSelectedWard(value);
  };

  return (
    <div className="user-detail">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="user-detail__container">
          <div className="page-name">Profile</div>
          <Breadcrumb className="breadcrumb">
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
                  <div className="card-body__right__name">{displayFirstName + ' ' + displayLastName}</div>
                  <div className="card-body__right__email">{displayEmail}</div>
                </div>
              </div>
              <div>
                <Button className="message-btn" icon={<MessageFilled />}>
                  Message
                </Button>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="card-body__container">
              <div className="personal-info">
                <div className="info__title">Personal Information</div>
                <div className="field">
                  <div className="field__title">Username</div>
                  <Input value={userAccount.username || ''} className="input" placeholder="Username" />
                </div>
                <div className="field">
                  <div className="field__title">First Name</div>
                  <Input
                    value={userProfile.firstName || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, firstName: e.target.value })}
                    className="input"
                    placeholder="First Name"
                  />
                </div>
                <div className="field">
                  <div className="field__title">Last Name</div>
                  <Input
                    value={userProfile.lastName || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, lastName: e.target.value })}
                    className="input"
                    placeholder="Last Name"
                  />
                </div>
                <div className="field">
                  <div className="field__title">Date of birth</div>
                  <DatePicker
                    defaultValue={moment(userProfile.dateOfBirth || '2022-01-01', dateFormat)}
                    onChange={onDateOfBirthChange}
                    format={dateFormat}
                    placeholder="Due date"
                    className="input"
                  />
                </div>
              </div>
              <div className="contact-info">
                <div className="info__title">Contact Information</div>
                <div className="field">
                  <div className="field__title">Email</div>
                  <Input value={userAccount.email || ''} className="input" />
                </div>
                <div className="field">
                  <div className="field__title">Phone</div>
                  <Input
                    value={userProfile.phoneNumber || ''}
                    onChange={(e) => setUserProfile({ ...userProfile, phoneNumber: e.target.value })}
                    className="input"
                    placeholder="Phone"
                  />
                </div>
                <div className="field">
                  <div className="field__title">Address</div>
                  <div className="input">
                    <Select
                      placeholder="Provinces"
                      style={{
                        width: '100%',
                      }}
                      onChange={handleChangeProvince}
                      value={selectedProvince}
                    >
                      {provinces.map((province) => (
                        <Select.Option value={province.code} key={province.code}>
                          {province.name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Districts"
                      style={{
                        width: '100%',
                        marginTop: '20px',
                      }}
                      onChange={handleChangeDistrict}
                      value={selectedDistrict}
                    >
                      {districts.map((district) => (
                        <Select.Option value={district.code} key={district.code}>
                          {district.name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Wards"
                      style={{
                        width: '100%',
                        marginTop: '20px',
                      }}
                      onChange={handleChangeWard}
                      value={selectedWard}
                    >
                      {wards.map((ward) => (
                        <Select.Option value={ward.code} key={ward.code}>
                          {ward.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="save-btn__container">
                <Button className="save-btn" onClick={handleUpdateUserProfile}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
