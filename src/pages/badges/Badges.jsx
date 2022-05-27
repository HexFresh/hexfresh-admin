import {Button, Input, message, Modal, Pagination, Tooltip} from "antd";
import {Search} from "@mui/icons-material";
import {CircularProgress, Grid, InputBase} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import './badges.css'
import {createBadge, deleteBadge, getBadges} from "../../api/badgesApi";
import axios from "axios";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const nPerPage = 6;

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const refInput = useRef(null);

  const fetchBadges = async (keyword, limit, offset) => {
    const data = await getBadges({keyword, limit, offset});
    setBadges(data.rows);
    setCount(data.count);
  }

  useEffect(() => {
    document.title = 'HexAd - List Badge';
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBadges(keyword, nPerPage, (page - 1) * nPerPage)]);
      setLoading(false);
    }
    fetchData();
  }, [page, keyword])

  const handleChangePage = (page) => {
    setPage(page);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleCreate();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setImageFile(null);
  };

  const uploadNewBadgeImage = (file) => {
    if (file) {
      setImageFile(file);
    }
  };

  const handleCreate = async () => {
    message.loading('Creating...').then(async () => {
      const data = new FormData();
      data.append('file', imageFile);
      data.append('upload_preset', 'qk9dvfij');
      const res = await axios.post(`https://api.cloudinary.com/v1_1/hexfresh/image/upload`, data);

      const result = await createBadge({title, description, image: res.data.secure_url});
      if (result) {
        message.success('Created!', 0.5);
        await fetchBadges(keyword, nPerPage, (page - 1) * nPerPage);
        setIsModalVisible(false);
        setTitle('');
        setDescription('');
        setImageFile(null);
      }
    });
  }

  function handleRemoveBadge(id) {
    message.loading('Deleting...').then(async () => {
      await deleteBadge(id);
      message.success('Deleted!', 0.5);
      await fetchBadges(keyword, nPerPage, (page - 1) * nPerPage);
    });
  }

  return (<div className="badges">
    <div className="badges__container">
      <div className="top">
        <div className="page-name">Badges</div>
        <div className="add-program">
          <Button type="primary" onClick={showModal}>
            Create new badge
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
        {loading ? (<CircularProgress/>) : badges.length > 0 ? (<div className="programs__container">
          <Grid container spacing={2}>
            {badges.map((badge) => {
              return (<Grid key={badge.id} item xs={12} sm={6} lg={2}>
                <div className="program">
                  <div className="cover-photo">
                    <img
                      src={badge.image}
                      alt="img"
                    />
                    <Tooltip className={"remove-btn"} title="remove">
                      <Button onClick={() => handleRemoveBadge(badge.id)} type="circle" shape="circle"
                              icon={<DeleteOutlined/>}/>
                    </Tooltip>
                  </div>
                  <div className="program-name">
                    <div className="program-title">
                      {badge.title}
                    </div>
                    <div className="program-description">
                      {badge.description}
                    </div>
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
        <Pagination current={page} total={count} pageSize={nPerPage} onChange={handleChangePage} hideOnSinglePage/>
      </div>
    </div>
    <Modal
      className="modal"
      title="Create new badge"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[<Button key="back" onClick={handleCancel}>
        Cancel
      </Button>, <Button disabled={title === "" || description === "" || imageFile === null} key="submit" type="primary"
                         onClick={handleOk}>
        Create
      </Button>,]}
    >
      <div className="form-badge">
        <div className="field">
          <label>Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="field">
          <label>Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)}/>
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
