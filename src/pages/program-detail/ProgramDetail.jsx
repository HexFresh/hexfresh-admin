/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import './program-detail.css';
import {addAvailableBadgeToProgram, addNewBadgeToProgram, getProgramDetail} from './api';
import {getBadgeOfProgram, getBadges} from "../../api/badgesApi";
import {CircularProgress} from '@mui/material';
import {Button, Input, message, Modal, Switch, Tag, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import {Select} from 'antd';
import {findAllUsersInLeaderboard, updateStatusOfLeaderboard} from "../../api/leaderboardApi";

const {Option} = Select;

export default function ProgramDetail() {
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState({});
  const [badges, setBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [addBadgeMode, setAddBadgeMode] = useState('available');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [leaderboard, setLeaderboard] = useState({});
  const [loadingStatus, setLoadingStatus] = useState(false);

  const refInput = useRef(null);
  const {programId} = useParams();


  const fetchProgram = async () => {
    const result = await getProgramDetail(programId);
    setProgram(result || {});
  };

  const fetchBadges = async () => {
    const result = await getBadgeOfProgram(programId);
    setBadges(result || []);
  }

  const fetchAllBadges = async () => {
    const result = await getBadges({keyword: '', limit: 100});
    setAllBadges(result.rows || []);
  }

  const fetchLeaderboard = async () => {
    const result = await findAllUsersInLeaderboard(programId);
    setLeaderboard(result);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProgram(), fetchBadges(), fetchAllBadges(), fetchLeaderboard()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderRole = (roleId) => {
    switch (roleId) {
      case 1:
        return <Tag color="green">Admin</Tag>;
      case 2:
        return <Tag color="blue">HR</Tag>;
      case 3:
        return <Tag color="purple">Mentor</Tag>;
      case 4:
        return <Tag color="orange">Fresher</Tag>;
      default:
        return <Tag color="red">Unknown</Tag>;
    }
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (addBadgeMode === 'available') {
      if (!selectedBadge) {
        message.error({content: 'Please select a badge to add'});
      } else {
        handleAddAvailableBadgeToProgram()
      }

    } else {
      if (!title || !description || !imageFile) {
        message.error({content: 'Please fill all fields'});
      } else {
        handleAddNewBadgeToProgram();
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setImageFile(null);
    setSelectedBadge(null);
    setAddBadgeMode('available');
  };

  const uploadNewBadgeImage = (file) => {
    if (file) {
      setImageFile(file);
    }
  };

  const handleAddAvailableBadgeToProgram = async () => {
    const result = await addAvailableBadgeToProgram(programId, selectedBadge);
    if (result) {
      message.success('Add badge successfully', 0.5);
      await fetchBadges();
      await fetchAllBadges();
      handleCancel();
    }
  }

  const handleAddNewBadgeToProgram = async () => {
    message.loading('Creating...').then(async () => {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'qk9dvfij');
      const res = await axios.post(`https://api.cloudinary.com/v1_1/hexfresh/image/upload`, data);
      const result = await addNewBadgeToProgram(programId, {
        title, description, image: res.data.secure_url
      })
      if (result) {
        message.success('Add badge successfully', 0.5);
        await fetchBadges();
        await fetchAllBadges();
        handleCancel();
      }
    });
  }

  const handleChangeLeaderboardStatus = async (checked) => {
    const change = async () => {
      setLoadingStatus(true);
      const result = await updateStatusOfLeaderboard(programId, checked ? true : "0");
      if (result) {
        message.success('Change status successfully', 0.5);
        await fetchLeaderboard();
      }
      setLoadingStatus(false);
    }
    await change();
  }

  return (<div className="program-detail">
    {loading ? (<CircularProgress/>) : (<div className="program-detail-container">
      <div className="top">
        <div className="page-name">{program.title}</div>
        <div className="add-program">

        </div>
      </div>
      <div className="program-detail-bottom">
        <div className={"users"}>
          <div className="users-title">
            <div className="users-title-name">Users</div>
            <div className="users-title-btn">
              <Button type="primary">
                Add user
              </Button>
            </div>
          </div>
          <div className="users-list">
            {program?.participants?.map(participant => {
              return (<div key={participant.id} className="user">
                <div className="user-left">
                  <div className="user-avatar">
                    <img style={{
                      width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover',
                    }}
                         src={participant.user_information.avatar ?? "https://i0.wp.com/lh3.googleusercontent.com/-Jsg_ToJfbm4/WHmCdcXhHSI/AAAAAAAAAoU/XgAWhvRAASM/s0/58798274ad088.jpg"}
                         alt=""/>
                  </div>
                  <div className="user-name">{participant.username}</div>
                </div>
                <div className="user-right">{renderRole(participant?.role?.id)}</div>

              </div>)
            })}
          </div>

        </div>
        <div className={"badges"}>
          <div className="badges-title">
            <div className="badges-title-name">Badges</div>
            <div className="badges-title-btn">
              <Button type="primary" onClick={showModal}>
                Add badge
              </Button>
            </div>
          </div>
          <div className="badges-list">
            {badges.map(badge => {
              return (<div key={badge.id} className="badge">
                <div className="badge-left">
                  <div className="badge-avatar">
                    <img style={{
                      width: '50px', height: '50px', objectFit: 'cover',
                    }}
                         src={badge.image}
                         alt=""/>
                  </div>
                  <div className="badge-name">{badge.title}</div>
                </div>
                <div className="badge-right">
                  <Tooltip className={"remove-btn"} title="remove">
                    <Button type="circle" shape="circle"
                            icon={<DeleteOutlined/>}/>
                  </Tooltip>
                </div>
              </div>)
            })}
          </div>
        </div>

        <div className={"badges"}>
          <div className="badges-title">
            <div className="badges-title-name">Leaderboard</div>
            <div className="badges-title-btn">
              <Switch checked={leaderboard.isActive} loading={loadingStatus} checkedChildren="Active"
                      unCheckedChildren="Block" onChange={handleChangeLeaderboardStatus}/>
            </div>
          </div>
          <div className="badges-list">
            {leaderboard?.user_leaderboards?.map((user, index) => {
              return (<div key={user.id} className="badge">
                <div className="badge-left">
                  <div
                    className="badge-rank">{index + 1}</div>
                  <div className="badge-avatar">
                    <img style={{
                      width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%',
                    }}
                         src={user?.user?.user_information.avatar || "https://i0.wp.com/lh3.googleusercontent.com/-Jsg_ToJfbm4/WHmCdcXhHSI/AAAAAAAAAoU/XgAWhvRAASM/s0/58798274ad088.jpg"}
                         alt=""/>
                  </div>
                  <div className="badge-name">{user?.user.username}</div>
                </div>
                <div className="badge-right">
                  {user?.point}
                </div>
              </div>)
            })}
          </div>
        </div>
      </div>
    </div>)}
    <Modal
      className="modal"
      title="Add badge to program"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[<Button key="back" onClick={handleCancel}>
        Cancel
      </Button>, <Button key="create" type="primary" onClick={handleOk}>
        Create
      </Button>,]}
    >
      <div style={{display: 'flex'}}>
        <div style={{width: '150px'}}>
          Mode
        </div>
        <Select value={addBadgeMode} style={{width: '100%'}} onChange={(value) => setAddBadgeMode(value)}>
          <Option value="available">Chọn badge có sẵn</Option>
          <Option value="new">Thêm badge mới</Option>
        </Select>
      </div>

      {addBadgeMode === 'available' ? (<div style={{display: 'flex', marginTop: '20px'}}>
        <div style={{width: '150px'}}>
          Badge
        </div>
        <Select placeholder={"Select badge"} value={selectedBadge} style={{width: '100%'}}
                onChange={(value) => setSelectedBadge(value)}>
          {allBadges.map(badge => {
            return (<Option key={badge.id} value={badge.id}>{badge.title}</Option>)
          })}
        </Select>
      </div>) : (<div className="form-add-badge">
        <div style={{display: 'flex', marginTop: '20px'}}>
          <div style={{width: '150px'}}>Title</div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div style={{display: 'flex', marginTop: '20px'}}>
          <div style={{width: '150px'}}>Description</div>
          <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <div style={{display: 'flex', marginTop: '20px'}}>
          <div style={{width: '150px'}}>Image</div>
          <div style={{width: '100%'}}>
            {imageFile === null ? <></> : (
              <img src={URL.createObjectURL(imageFile)} alt="img" style={{width: '200px', marginBottom: '20px'}}/>)}
            <Button
              style={{width: '100%'}}
              onClick={() => {
                refInput.current?.click();
              }}
              className="edit-btn"
              icon={imageFile === null ? <PlusOutlined/> : <EditOutlined/>}
            >
              <input
                ref={refInput}
                style={{display: 'none'}}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.target.files) {
                    uploadNewBadgeImage(event.target.files[0]);
                    event.target.value = null;
                  }
                }}
              />
            </Button>
          </div>
        </div>
      </div>)}
    </Modal>
  </div>);
}
