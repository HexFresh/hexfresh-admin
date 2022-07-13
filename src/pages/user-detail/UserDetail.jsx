/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import './user-detail.css';
import {Link, useParams} from 'react-router-dom';
import {
  createNewEmptyUserProfile,
  getUserAccountById,
  getUserProfileById,
  updateUserProfile,
  getAllDegree,
  getAllJobPosition,
  getAllMentorOfFresher,
  deleteMentorOfFresher,
  addMentorOfFresher,
  disableAnAccount,
  enableAnAccount
} from '../../api/userProfile';
import {getUsers} from '../../api/hr/userApi';
import {CircularProgress} from '@mui/material';
import {Breadcrumb, Button, message, Input, DatePicker, Select, Switch} from 'antd';
import {UserOutlined, MessageFilled} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import Avatar from "@mui/material/Avatar";

const dateFormat = 'YYYY-MM-DD';
const BASE_ADDRESS_API_URL = 'https://provinces.open-api.vn/api';

function onlySpaces(str) {
  return str.trim().length === 0;
}

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
  const [selectedStreet, setSelectedStreet] = useState('');
  const [degrees, setDegrees] = useState([]);
  const [jobPositions, setJobPositions] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [oldMentor, setOldMentor] = useState(null);
  const [newMentor, setNewMentor] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const {userId} = useParams();

  const fetchUserAccount = async () => {
    const result = await getUserAccountById(userId);
    console.log(result);
    setUserAccount(result);
    setDisplayEmail(result.email);
    if (result.roleId === 4) {
      const resultMentor = await getAllMentorOfFresher(userId);
      if (resultMentor.length > 0) {
        setOldMentor(resultMentor[0].id);
        setNewMentor(resultMentor[0].id);
      }
    }
  };

  const fetchMentors = async () => {
    const result = await getUsers({roleId: 3});
    const data = result.rows.map((user) => ({...user, key: user.id}));
    setMentors(data || []);
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
    const result = await getUserProfileById(userId);
    if (result === undefined) {
      const newUF = {
        address: {
          province: null, district: null, ward: null, street: null, country: 'Vietnam',
        },
      };
      await createNewEmptyUserProfile(userId, newUF);
      await fetchUserProfile();
    } else {
      setUserProfile(result);
      setDisplayFirstName(result.firstName || '');
      setDisplayLastName(result.lastName || '');
      setSelectedProvince(result?.address?.province || null);
      setSelectedDistrict(result?.address?.district || null);
      setSelectedWard(result?.address?.ward || null);
      setSelectedStreet(result?.address?.street || '');
      await fetchProvinces();
      if (result?.address?.province?.split(',')[0]) {
        await fetchDistricts(result?.address?.province?.split(',')[0]);
        if (result?.address?.district.split(',')[0]) {
          await fetchWards(result?.address?.district?.split(',')[0]);
        }
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUserAccount(), fetchUserProfile(), fetchProvinces(), fetchMentors(), fetchAllDegree(), fetchAllJobPosition(),]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUserProfile = async () => {
    if (onlySpaces(userProfile.firstName)) {
      message.error('First name could not be empty');
      return;
    }
    if (onlySpaces(userProfile.lastName)) {
      message.error('Last name could not be empty');
      return;
    }
    message.loading('Updating...').then(async () => {
      const newUserProfile = {
        ...userProfile, address: {
          province: selectedProvince || '',
          district: selectedDistrict || '',
          ward: selectedWard || '',
          country: 'Vietnam',
          street: selectedStreet || '',
        },
      };
      if (oldMentor !== newMentor) {
        const resultDelete = await deleteMentorOfFresher(userId, oldMentor);
        if (resultDelete) {
          await addMentorOfFresher(userId, newMentor);
        }
      }
      const result = await updateUserProfile(userId, newUserProfile);
      if (result) {
        message.success('Updated!', 0.5);
      }
      await fetchUserProfile();
      await fetchUserAccount();
      setEdit(false);
    });
  };

  const onDateOfBirthChange = (date, dateString) => {
    setUserProfile({...userProfile, dateOfBirth: dateString});
  };

  const fetchProvinces = async () => {
    const rdata = await axios.get(`${BASE_ADDRESS_API_URL}/p/`);
    setProvinces(rdata.data);
  };

  const fetchDistricts = async (provinceCode) => {
    const rdata = await axios.get(`${BASE_ADDRESS_API_URL}/p/${provinceCode}`, {params: {depth: 2}});
    setDistricts(rdata.data.districts || []);
  };
  const fetchWards = async (districtCode) => {
    const rdata = await axios.get(`${BASE_ADDRESS_API_URL}/d/${districtCode}`, {params: {depth: 2}});
    setWards(rdata.data.wards || []);
  };

  const handleChangeProvince = async (value) => {
    setSelectedProvince(value);
    await fetchDistricts(value.split(',')[0]);
    setSelectedDistrict(null);
    setSelectedWard(null);
  };

  const handleChangeDistrict = async (value) => {
    setSelectedDistrict(value);
    await fetchWards(value.split(',')[0]);
    setSelectedWard(null);
  };

  const handleChangeWard = async (value) => {
    setSelectedWard(value);
  };

  const handleChangeStatusOfUserAccount = async () => {
    const change = async () => {
      setLoadingStatus(true);
      if (userAccount.isActive) {
        const result = await disableAnAccount(userId);
        if (result) {
          message.success('Change status successfully', 0.5);
          await fetchUserAccount();
        }
        setLoadingStatus(false);
      } else {
        const result = await enableAnAccount(userId);
        if (result) {
          message.success('Change status successfully', 0.5);
          await fetchUserAccount();
        }
        setLoadingStatus(false);
      }
    }
    await change();
  }

  return (<div className="user-detail">
    {loading ? (<CircularProgress/>) : (<div className="user-detail__container">
      <div className="page-name">Profile</div>
      <Breadcrumb className="breadcrumb">
        <Breadcrumb.Item>
          <Link to="/users">
            <UserOutlined
              style={{
                marginRight: '5px',
              }}
            />
            <span>List User</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Profile</Breadcrumb.Item>
      </Breadcrumb>
      <div className="card-body">
        <div className="cover-img">
          <div className="card__infor">
            <div className="avatar">
              <Avatar
                style={{
                  width: '100px', height: '100px',
                }}
                id="basic-button"
                src={userProfile?.avatar}
              >
                {<div style={{
                  fontWeight: 'bold', fontSize: '50px',
                }}>{localStorage.getItem('username').charAt(0).toUpperCase()}</div>}
              </Avatar>
            </div>
            <div className="card-body__right">
              <div className="card-body__right__name">{displayFirstName + ' ' + displayLastName}</div>
              <div className="card-body__right__email">{displayEmail}</div>
            </div>
          </div>
          <div>
            <Button className="message-btn" icon={<MessageFilled/>}>
              Message
            </Button>
          </div>
        </div>
        {localStorage.getItem("roleId") === '1' && <div className="status-btn">
          <Switch checked={userAccount?.isActive} loading={loadingStatus} checkedChildren="Active"
                  unCheckedChildren="Block" onChange={handleChangeStatusOfUserAccount}/>
        </div>}
      </div>

      <div className="card-body">
        <div className="card-body__container">
          <div className="personal-info">
            <div className="info__title">Personal Information</div>
            <div className="field">
              <div className="field__title">Username</div>
              <Input disabled value={userAccount.username || ''} className="input" placeholder="Username"/>
            </div>
            <div className="field">
              <div className="field__title">First Name</div>
              <Input
                disabled={!edit}
                value={userProfile.firstName || ''}
                onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                className="input"
                placeholder="First Name"
              />
            </div>
            <div className="field">
              <div className="field__title">Last Name</div>
              <Input
                disabled={!edit}
                value={userProfile.lastName || ''}
                onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                className="input"
                placeholder="Last Name"
              />
            </div>
            <div className="field">
              <div className="field__title">Date of birth</div>
              <DatePicker
                disabled={!edit}
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
                disabled={!edit}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                className="input"
                placeholder="Gender"
                onChange={(value) => setUserProfile({...userProfile, gender: value})}
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
                disabled={!edit}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder="Degree"
                className="input"
                onChange={(value) => setUserProfile({...userProfile, degreeId: value})}
                value={userProfile?.degree?.id}
              >
                {degrees.map((degree) => (<Select.Option value={degree.id} key={degree.id}>
                  {degree.name}
                </Select.Option>))}
              </Select>
            </div>

            <div className="field">
              <div className="field__title">Job position</div>
              <Select
                disabled={!edit}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                className="input"
                placeholder="Job position"
                onChange={(value) => setUserProfile({...userProfile, jobPositionId: value})}
                value={userProfile?.job_position?.id}
              >
                {jobPositions.map((job) => (<Select.Option value={job.id} key={job.id}>
                  {job.name}
                </Select.Option>))}
              </Select>
            </div>
            {userAccount.roleId === 4 && (<div className="field">
              <div className="field__title">Mentor</div>
              <Select
                disabled={!edit}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                className="input"
                placeholder="Mentor"
                onChange={(value) => setNewMentor(value)}
                value={newMentor}
              >
                {mentors.map((mentor) => (<Select.Option value={mentor.id} key={mentor.id}>
                  {mentor.username}
                </Select.Option>))}
              </Select>
            </div>)}
          </div>
          <div className="contact-info">
            <div className="info__title">Contact Information</div>
            <div className="field">
              <div className="field__title">Email</div>
              <Input disabled value={userAccount.email || ''} className="input"/>
            </div>
            <div className="field">
              <div className="field__title">Phone</div>
              <Input
                disabled={!edit}
                value={userProfile.phoneNumber || ''}
                onChange={(e) => setUserProfile({...userProfile, phoneNumber: e.target.value})}
                className="input"
                placeholder="Phone"
              />
            </div>
            <div className="field">
              <div className="field__title">Address</div>
              <div className="input">
                <div className="select">
                  <Select
                    disabled={!edit}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder="Province"
                    style={{
                      width: '100%',
                    }}
                    onChange={handleChangeProvince}
                    value={selectedProvince}
                  >
                    {provinces.map((province) => (
                      <Select.Option value={`${province.code},${province.name}`} key={province.code}>
                        {province.name}
                      </Select.Option>))}
                  </Select>
                  <Select
                    disabled={!edit}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder="District"
                    style={{
                      width: '100%',
                    }}
                    onChange={handleChangeDistrict}
                    value={selectedDistrict}
                  >
                    {districts.map((district) => (
                      <Select.Option value={`${district.code},${district.name}`} key={district.code}>
                        {district.name}
                      </Select.Option>))}
                  </Select>
                  <Select
                    disabled={!edit}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    placeholder="Ward"
                    style={{
                      width: '100%',
                    }}
                    onChange={handleChangeWard}
                    value={selectedWard}
                  >
                    {wards.map((ward) => (<Select.Option value={`${ward.code},${ward.name}`} key={ward.code}>
                      {ward.name}
                    </Select.Option>))}
                  </Select>
                </div>
                <Input
                  disabled={!edit}
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
            {edit ? (<Button className="save-btn" onClick={handleUpdateUserProfile}>
              Save
            </Button>) : (<Button className="editprofile-btn" onClick={() => setEdit(true)}>
              Edit
            </Button>)}
          </div>
        </div>
      </div>
    </div>)}
  </div>);
}
