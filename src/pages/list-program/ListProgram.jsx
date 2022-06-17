import React, {useEffect, useRef, useState} from 'react';
import {CircularProgress, Grid, InputBase} from '@mui/material';
import {Link} from 'react-router-dom';
import {Button, Input, message, Modal, Pagination, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Search} from '@mui/icons-material';
import {createProgram, getPrograms, removeProgram} from '../../api/hr/programApi';
import './list-program.css';
import axios from "axios";

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
    if (name) {
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

  const handleRemoveProgram = async (id) => {
    await removeProgram(id);
    message.success({content: 'Removed', key: 'success'});
    await fetchPrograms(keyword, nPerPage, (page - 1) * nPerPage);
  }

  const uploadNewBadgeImage = (file) => {
    if (file) {
      setImageFile(file);
    }
  };

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
                <div className="program">
                  <div className="cover-photo">
                    <img
                      src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/80a9d98d-327f-4bb2-b173-4298d710e51c/derkflv-9f975f3d-791f-4e16-8d9d-fb0a9e5e0554.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzgwYTlkOThkLTMyN2YtNGJiMi1iMTczLTQyOThkNzEwZTUxY1wvZGVya2Zsdi05Zjk3NWYzZC03OTFmLTRlMTYtOGQ5ZC1mYjBhOWU1ZTA1NTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.eEDVAlJGBqXo6OeZEORXWk1veGSHFL-ZTUMz43Jtr3Q"
                      alt="img"
                    />
                    <Tooltip className={"remove-btn"} title="remove">
                      <Button type="circle" shape="circle"
                              onClick={() => handleRemoveProgram(program.id)}
                              icon={<DeleteOutlined/>}/>
                    </Tooltip>
                  </div>
                  <div className="program-name">
                    <Link className="link" to={`/programs/${program.id}`}>
                      {program.title}
                    </Link>
                  </div>
                </div>
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
      title="Create new phase"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[<Button key="back" onClick={handleCancel}>
        Cancel
      </Button>, <Button key="submit" type="primary" onClick={handleOk}>
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
