import {Button, Input, message, Modal, Pagination} from "antd";
import {Search} from "@mui/icons-material";
import {CircularProgress, Grid, InputBase} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import './badges.css'
import {createBadge, getBadges} from "../../api/badgesApi";
import axios from "axios";
import {PlusOutlined} from "@ant-design/icons";

const nPerPage = 4;

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState("");

  const refInput = useRef(null);

  const fetchBadges = async (keyword, limit, offset) => {
    const data = await getBadges({keyword, limit, offset});
    console.log(data);
    setBadges(data);
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
    setImage('');
  };

  const uploadNewBadgeImage = async (file) => {
    if (file) {
      message.loading('Loading...').then(async () => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'qk9dvfij');
        const res = await axios.post(`https://api.cloudinary.com/v1_1/hexfresh/image/upload`, data);
        if (res) {
          message.success('Uploaded!', 0.5);
          setImage(res.data.secure_url);
        }
      });
    }
  };

  const handleCreate = async () => {
    message.loading('Creating...').then(async () => {
      const data = await createBadge({title, description, image});
      if (data) {
        message.success('Created!', 0.5);
        await fetchBadges(keyword, nPerPage, (page - 1) * nPerPage);
        setIsModalVisible(false);
        setTitle('');
        setDescription('');
        setImage('');
      }
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
        {loading ? (<CircularProgress/>) : count > 0 ? (<div className="programs__container">
          <Grid container spacing={2}>
            {badges.map((badge) => {
              return (<Grid key={badge.id} item xs={12} sm={6} lg={3}>
                <div className="program">
                  <div className="cover-photo">
                    <img
                      src={badge.image}
                      alt="img"
                    />
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
        <Pagination current={page} total={count} pageSize={4} hideOnSinglePage/>
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
      </Button>, <Button disabled={title === "" || description === "" || image === ""} key="submit" type="primary"
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
          {image === "" ? (<></>) : (<img src={image} alt="img" className="img-badge"/>)}
          <Button
            onClick={() => {
              refInput.current?.click();
            }}
            className="edit-btn"
            icon={<PlusOutlined/>}
          >
            <input
              ref={refInput}
              style={{display: 'none'}}
              type="file"
              accept="image/*"
              onChange={(event) => {
                if (event.target.files) {
                  uploadNewBadgeImage(event.target.files[0]);
                }
              }}
            />
          </Button>

        </div>
      </div>
    </Modal>
  </div>);
}