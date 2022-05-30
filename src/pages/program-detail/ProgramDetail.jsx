/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import './program-detail.css';
import {getProgramDetail} from './api';
import {getBadgeOfProgram} from "../../api/badgesApi";
import {CircularProgress} from '@mui/material';
import {Button, Tag} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

export default function ProgramDetail() {
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState({});
  const [badges, setBadges] = useState([]);

  const fetchProgram = async () => {
    const result = await getProgramDetail(programId);
    console.log(result);
    setProgram(result || {});
  };

  const fetchBadges = async () => {
    const result = await getBadgeOfProgram(programId);
    console.log(result);
    setBadges(result || []);
  }

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchProgram(), fetchBadges()]);
    setLoading(false);
  };

  const {programId} = useParams();

  useEffect(() => {
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

  return (<div className="program-detail">
    {loading ? (<CircularProgress/>) : (<div className="program-detail-container">
      <div className="top">
        <div className="page-name">{program.title}</div>
        <div className="add-program">
          <Button type="primary" icon={<PlusOutlined/>}>
            Add user to program
          </Button>
        </div>
      </div>
      <div className="program-detail-bottom">
        <div className={"users"}>
          <div className="users-title">Users</div>
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
          {badges?.map(badge => {
            return (<div key={badge.id} className="badge">
              <div className="badge-name">{badge.name}</div>
              <div className="badge-image">
                <img src={badge.image} alt=""/>
              </div>
            </div>)
          })}
        </div>
      </div>
    </div>)}
  </div>);
}
