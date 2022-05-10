/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './program-detail.css';
import { getProgramDetail } from './api';
import { CircularProgress } from '@mui/material';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function ProgramDetail() {
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState({});

  const fetchProgram = async () => {
    const result = await getProgramDetail(programId);
    console.log(result);
    setProgram(result || {});
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchProgram();
    setLoading(false);
  };

  const { programId } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="program-detail">
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="program-detail-container">
          <div className="top">
            <div className="page-name">{program.title}</div>
            <div className="add-program">
              <Button type="primary" icon={<PlusOutlined />}>
                Add user to program
              </Button>
            </div>
          </div>
          <div className="program-detail-bottom"></div>
        </div>
      )}
    </div>
  );
}
