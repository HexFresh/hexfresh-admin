import React, {useEffect, useRef, useState} from 'react';
import {CircularProgress, Grid, InputBase} from '@mui/material';
import {Button, Input, message, Modal, Pagination} from 'antd';
import { EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Search} from '@mui/icons-material';
import {createProgram, getPrograms} from '../../api/hr/programApi';
import './list-program.css';
import axios from "axios";
import ProgramItem from "./ProgramItem";

const nPerPage = 4;

function ListProgram() {
  const [loading, setLoading] = React.useState(false);
  const [programs, setPrograms] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [name, setName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const [imageFile, setImageFile] = useState(null);

  const refInput = useRef(null);

  const fetchPrograms = async (keyword, limit, offset) => {
    setLoading(true);
    const result = await getPrograms({keyword, limit, offset});
    setPrograms(result.rows || []);
    setCount(result.count);
    setLoading(false);
  };

  useEffect(() => {
    document.title = 'HexAd - List Program';
    fetchPrograms(keyword, nPerPage, (page - 1) * nPerPage);
  }, [page, keyword]);

  const handleChangePage = (page) => {
    setPage(page);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    submitNewProgram();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setName('');
    setImageFile(null);
  };

  const changeNewName = (e) => {
    setName(e.target.value);
  };

  const submitNewProgram = async () => {
    if (name && imageFile) {
      message.loading('Creating...').then(async () => {
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', 'qk9dvfij');
        const res = await axios.post(`https://api.cloudinary.com/v1_1/hexfresh/image/upload`, data);

        const result = await createProgram({title: name, image: res.data.secure_url});
        if (result) {
          message.success('Created!', 0.5);
          await fetchPrograms(keyword, nPerPage, (page - 1) * nPerPage);
          setIsModalVisible(false);
          setName('');
          setImageFile(null);
        }
      });
    }
  };

  const uploadNewBadgeImage = (file) => {
    if (file) {
      setImageFile(file);
    }
  };

  const refreshPrograms = async () => {
    await fetchPrograms(keyword, nPerPage, (page - 1) * nPerPage);
    setPage(1)
  }

  return (<div className="list-program">
    <div className="list-program__container">
      <div className="top">
        <div className="page-name">Programs</div>
        <div className="add-program">
          <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
            Create new program
          </Button>
        </div>
      </div>
      <div className="filter-search">
        <div className="search">
          <Search style={{width: '20px', height: '20px'}}/>
          <InputBase
            value={keyword}
            onChange={(e) => {
              setPage(1);
              setKeyword(e.target.value);
            }}
            placeholder="Search"
            style={{fontSize: '14px', width: '100%'}}
          />
        </div>
        <div className="filter"></div>
      </div>
      <div className="programs">
        {loading ? (<CircularProgress/>) : count > 0 ? (<div className="programs__container">
          <Grid container spacing={2}>
            {programs.map((program) => {
              return (<Grid key={program.id} item xs={12} sm={6} lg={3}>
                <ProgramItem program={program}
                             refreshPrograms={refreshPrograms}/>
              </Grid>);
            })}
          </Grid>
        </div>) : (<div className="img-404">
          <img style={{height: '200px'}} src="/no-records.png" alt="no-record"/>
        </div>)}
      </div>
      <div className="pagination">
        <Pagination current={page} total={count} pageSize={4} onChange={handleChangePage} hideOnSinglePage/>
      </div>
    </div>
    <Modal
      className="modal"
      title="Create new program"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[<Button key="back" onClick={handleCancel}>
        Cancel
      </Button>, <Button key="submit" type="primary" onClick={handleOk} disabled={name === "" || imageFile === null}>
        Create
      </Button>,]}
    >
      <div className="form-program">
        <div className="field">
          <label>Title</label>
          <Input value={name} onChange={changeNewName}/>
        </div>

        <div className="field">
          <label>Image</label>
          {imageFile === null ? <></> : (<img src={URL.createObjectURL(imageFile)} alt="img" className="img-badge"/>)}
          <Button
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
    </Modal>
  </div>);
}

export default ListProgram;
