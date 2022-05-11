/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import './user-profile.css';
import { useParams } from 'react-router-dom';
import {
  createCurrentNewEmptyUserProfile,
  getUserAccountById,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getAllDegree,
  getAllJobPosition,
} from '../../api/userProfile';
import { CircularProgress } from '@mui/material';
import { Button, message, Input, DatePicker, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
const BASE_ADDRESS_API_URL = 'https://provinces.open-api.vn/api';

export default function UserProfile() {
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
  const [selectedStreet, setSelectedStreet] = useState('');
  const [degrees, setDegrees] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);

  const { userId } = useParams();
  const refInput = useRef(null);

  const fetchUserAccount = async () => {
    const result = await getUserAccountById(userId);
    setUserAccount(result);
    setDisplayEmail(result.email);
  };

  const fetchAllDegree = async () => {
    const result = await getAllDegree();
    setDegrees(result || []);
  };

  const fetchAllJobPosition = async () => {
    const result = await getAllJobPosition();
    setJobPositions(result || []);
  };

  const fetchUserProfile = async () => {
    const result = await getCurrentUserProfile();
    if (result === undefined) {
      const newUF = {
        address: {
          province: null,
          district: null,
          ward: null,
          street: null,
          country: 'Vietnam',
        },
      };
      await createCurrentNewEmptyUserProfile(newUF);
      await fetchUserProfile();
    } else {
      setUserProfile(result);
      setDisplayFirstName(result.firstName || '');
      setDisplayLastName(result.lastName || '');
      setSelectedProvince(Number(result?.address?.province) || null);
      setSelectedDistrict(Number(result?.address?.district) || null);
      setSelectedWard(Number(result?.address?.ward) || null);
      setSelectedStreet(result?.address?.street || '');
      await fetchProvinces();
      if (Number(result?.address?.province)) {
        await fetchDistricts(Number(result?.address?.province));
        if (Number(result?.address?.district)) {
          await fetchWards(Number(result?.address?.district));
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserAccount(),
        fetchUserProfile(),
        fetchProvinces(),
        fetchAllDegree(),
        fetchAllJobPosition(),
      ]);
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
          await updateCurrentUserProfile({ avatar: res.data.secure_url });
          await fetchUserProfile();
        }
      });
    }
  };

  const handleUpdateUserProfile = async () => {
    message.loading('Updating...').then(async () => {
      const newUserProfile = {
        ...userProfile,
        address: {
          province: selectedProvince,
          district: selectedDistrict,
          ward: selectedWard,
          country: 'Vietnam',
          street: selectedStreet,
        },
      };

      const result = await updateCurrentUserProfile(newUserProfile);
      if (result) {
        message.success('Updated!', 0.5);
      }
      await fetchUserProfile();
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
    <div className="user-profile">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="user-profile__container">
          <div className="page-name">Your Profile</div>
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
                <div className="field">
                  <div className="field__title">Gender</div>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    className="input"
                    placeholder="Gender"
                    onChange={(value) => setUserProfile({ ...userProfile, gender: value })}
                    value={userProfile?.gender}
                  >
                    <Select.Option value="Male" key="0">
                      Male
                    </Select.Option>
                    <Select.Option value="Female" key="1">
                      Female
                    </Select.Option>
                    <Select.Option value="Other" key="2">
                      Other
                    </Select.Option>
                  </Select>
                </div>

                <div className="field">
                  <div className="field__title">Degree</div>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder="Degree"
                    className="input"
                    onChange={(value) => setUserProfile({ ...userProfile, degreeId: value })}
                    value={userProfile?.degreeId}
                  >
                    {degrees.map((degree) => (
                      <Select.Option value={degree.id} key={degree.id}>
                        {degree.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>

                <div className="field">
                  <div className="field__title">Job position</div>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    className="input"
                    placeholder="Job position"
                    onChange={(value) => setUserProfile({ ...userProfile, jobPositionId: value })}
                    value={userProfile?.jobPositionId}
                  >
                    {jobPositions.map((job) => (
                      <Select.Option value={job.id} key={job.id}>
                        {job.name}
                      </Select.Option>
                    ))}
                  </Select>
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
                    <div className="select">
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
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
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Districts"
                        style={{
                          width: '100%',
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
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        placeholder="Wards"
                        style={{
                          width: '100%',
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
                    <Input
                      value={selectedStreet || ''}
                      onChange={(e) => setSelectedStreet(e.target.value)}
                      style={{
                        width: '100%',
                      }}
                      placeholder="Street"
                    />
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
