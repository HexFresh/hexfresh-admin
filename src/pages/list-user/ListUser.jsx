import React, { useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  Input,
  message,
  Table,
  Tag,
  Pagination,
  Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getUsers, createUser } from '../../api/hr/userApi';
import './list-user.css';

const nPerPage = 6;

const { Option } = Select;

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    sorter: (a, b) => ('' + a.username).localeCompare(b.username),
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => ('' + a.email).localeCompare(b.email),
    render: (text) => <>{text}</>,
  },
  {
    title: 'Role',
    key: 'role',
    dataIndex: 'roleId',
    render: (roleId) => {
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
    },
  },
];

const initNewUser = {
  username: '',
  email: '',
  password: '',
  roleId: '1',
  mentorId: '',
};

function ListUser() {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newUser, setNewUser] = React.useState(initNewUser);
  const [keyword, setKeyword] = React.useState('');
  const [roleId, setRoleId] = React.useState('');

  const fetchUsers = async (keyword, roleId, limit, offset) => {
    setLoading(true);
    const result = await getUsers({ keyword, roleId, limit, offset });
    const data = result.rows.map((user) => ({ ...user, key: user.id }));
    setUsers(data || []);
    setCount(result.count);
    setLoading(false);
  };
  console.log({ users });

  useEffect(() => {
    document.title = 'List User';
    fetchUsers(keyword, roleId, nPerPage, (page - 1) * nPerPage);
  }, [page, keyword, roleId]);

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
  };

  const submitNewProgram = () => {
    const user = {
      ...newUser,
      roleId: Number(newUser.roleId),
      mentorId: Number(newUser.mentorId),
    };

    const handleCreateNewUser = async () => {
      message
        .loading({ content: 'Creating new user...', key: 'create-user' })
        .then(async () => {
          await createUser(user);
          fetchUsers(keyword, roleId, nPerPage, (page - 1) * nPerPage);
          message.success({
            content: 'Create new user successfully',
            key: 'create-user',
          });
        });
    };
    handleCreateNewUser();
    setIsModalVisible(false);
    setNewUser(initNewUser);
  };

  return (
    <div className="list-user">
      <div className="list-user__container">
        <div className="top">
          <div className="page-name">Users</div>
          <div className="add-user">
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Create new user
            </Button>
          </div>
        </div>
        <div className="filter-search">
          <div className="filter">Filter</div>
          <div className="search">
            <Search />
            <InputBase
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search"
            />
          </div>
        </div>
        <div className="users_beside">
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="users">
              <Table
                className="table"
                columns={columns}
                dataSource={users}
                pagination={false}
              />

              <div className="pagination">
                <Pagination
                  current={page}
                  total={count}
                  pageSize={6}
                  onChange={handleChangePage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        className="modal"
        title="Create new user"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create
          </Button>,
        ]}
      >
        <div className="form">
          <div className="field">
            <label>Username</label>
            <Input
              style={{ marginBottom: '20px' }}
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Email</label>
            <Input
              style={{ marginBottom: '20px' }}
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Password</label>
            <Input.Password
              style={{ marginBottom: '20px' }}
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label>Choose role</label>
            <Select
              defaultValue="Admin"
              value={newUser.roleId}
              onChange={(value) => setNewUser({ ...newUser, roleId: value })}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              <Option value="1">Admin</Option>
              <Option value="2">HR</Option>
              <Option value="3">Mentor</Option>
              <Option value="4">Fresher</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ListUser;
