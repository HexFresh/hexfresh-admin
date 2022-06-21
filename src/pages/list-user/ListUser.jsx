import React, {useEffect} from 'react';
import {CircularProgress} from '@mui/material';
import {Link} from 'react-router-dom';
import {Button, Modal, Input, message, Table, Tag, Pagination, Select} from 'antd';
import {InputBase} from '@mui/material';
import {Search} from '@mui/icons-material';
import {getUsers, createUser} from '../../api/hr/userApi';
import {createNotification} from '../../api/notification';
import './list-user.css';
import {useDispatch} from "react-redux";
import {getNotificationsAction} from "../../redux/notification/notification-slice";
import {getCountNotificationAction} from "../../redux/count-notification-slice";

const nPerPage = 6;

const {Option} = Select;
const {TextArea} = Input;

const columns = [{
  title: 'Username',
  dataIndex: 'username',
  key: 'username',
  sorter: (a, b) => ('' + a.username).localeCompare(b.username),
  render: (text, user) => <Link to={`/users/${user.id}`}>{text}</Link>,
}, {
  title: 'Email',
  dataIndex: 'email',
  key: 'email',
  sorter: (a, b) => ('' + a.email).localeCompare(b.email),
  render: (text) => <>{text}</>,
}, {
  title: 'Role', key: 'role', dataIndex: 'roleId', render: (roleId) => {
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
}, {
  title: 'Status', key: 'status', dataIndex: 'isActive', render: (isActive) => {
    switch (isActive) {
      case false:
        return <Tag color="red">Inactive</Tag>;
      case true:
        return <Tag color="green">Active</Tag>;
      default:
        return <Tag color="red">Unknown</Tag>;
    }
  },
},];

const initNewUser = {
  username: '', email: '', password: '', roleId: '1', mentorId: '',
};

function ListUser() {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [fullUser, setFullUser] = React.useState([]);
  const [mentors, setMentors] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [newUser, setNewUser] = React.useState(initNewUser);
  const [keyword, setKeyword] = React.useState('');
  const [roleId, setRoleId] = React.useState('');

  const dispatch = useDispatch();

  const [notification, setNotification] = React.useState({
    recipients: [], title: '', body: '',
  });
  const [isNotificationModal, setIsNotificationModal] = React.useState(false);

  const handleChangeUsersToSendNotification = (value) => {
    if (value) {
      setNotification({
        ...notification, recipients: value,
      });
    } else {
      setNotification({
        ...notification, recipients: [],
      });
    }
  };

  const sendNotification = () => {
    message.loading('Sending notification...').then(async () => {
      const result = await createNotification(notification);
      if (result) {
        message.success('Notification sent!');
        setIsNotificationModal(false);
        setNotification({
          recipients: [], title: '', body: '',
        });
        const payload = {
          skip: (1 - 1) * nPerPage, limit: nPerPage
        }
        dispatch(getNotificationsAction(payload));
        dispatch(getCountNotificationAction());
      } else {
        message.error('Error sending notification!');
      }
    });
  };

  const fetchUsers = async (keyword, roleId, limit, offset) => {
    setLoading(true);
    const result = await getUsers({keyword, roleId, limit, offset});
    const fullResult = await getUsers({keyword: "", limit: result.count});
    const data = result.rows.map((user) => ({...user, key: user.id}));
    setUsers(data || []);
    setFullUser(fullResult.rows);
    setCount(result.count);
    setLoading(false);
  };

  const fetchMentors = async () => {
    const result = await getUsers({roleId: 3});
    const data = result.rows.map((user) => ({...user, key: user.id}));
    setMentors(data || []);
  };

  useEffect(() => {
    document.title = 'HexAd - List User';
    fetchUsers(keyword, roleId, nPerPage, (page - 1) * nPerPage);
    fetchMentors();
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

  const showNotificationModal = () => {
    setIsNotificationModal(true);
  };

  const handleNotificationOk = () => {
    sendNotification();
  };

  const handleNotificationCancel = () => {
    setIsNotificationModal(false);
    setNotification({
      recipients: [], title: '', body: '',
    });
  };

  const submitNewProgram = () => {
    const user = {
      ...newUser, roleId: Number(newUser.roleId), mentorId: newUser.mentorId,
    };

    const handleCreateNewUser = async () => {
      message.loading({content: 'Creating new user...', key: 'create-user'}).then(async () => {
        const result = await createUser(user);
        if (typeof result === 'string') {
          message.error({
            content: result, key: 'create-user',
          });
        } else {
          fetchUsers(keyword, roleId, nPerPage, (page - 1) * nPerPage);
          fetchMentors();
          message.success({
            content: 'Create new user successfully', key: 'create-user',
          });
          setIsModalVisible(false);
          setNewUser(initNewUser);
        }
      });
    };
    handleCreateNewUser();
  };

  return (<div className="list-user">
    <div className="list-user__container">
      <div className="top">
        <div className="page-name">Users</div>
        <div className="add-user">
          <Button
            type="primary"
            style={{
              marginRight: '10px',
            }}
            onClick={showNotificationModal}
          >
            Send notification
          </Button>
          <Button type="primary" onClick={showModal}>
            Create new user
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
        <div className="filter">
          <Select
            onChange={(value) => {
              setPage(1);
              setRoleId(value);
            }}
            style={{width: 200}}
            placeholder="Filter by role"
          >
            <Option value="">All</Option>
            <Option value="1">Admin</Option>
            <Option value="2">HR</Option>
            <Option value="3">Mentor</Option>
            <Option value="4">Fresher</Option>
          </Select>
        </div>
      </div>
      <div className="users_beside">
        {loading ? (<CircularProgress className="circular-progress"/>) : (<div className="users">
          <Table className="table" columns={columns} dataSource={users} pagination={false}/>

          <div className="pagination">
            <Pagination
              current={page}
              total={count}
              pageSize={nPerPage}
              onChange={handleChangePage}
              hideOnSinglePage
            />
          </div>
        </div>)}
      </div>
    </div>
    <Modal
      className="modal"
      title="Create new user"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[<Button key="back" onClick={handleCancel}>
        Cancel
      </Button>, <Button
        disabled={newUser.username === '' || newUser.email === '' || newUser.password === ''}
        key="submit"
        type="primary"
        onClick={handleOk}
      >
        Create
      </Button>,]}
    >
      <div className="form">
        <div className="field">
          <label>Username</label>
          <Input
            style={{marginBottom: '20px', marginTop: '5px'}}
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
          />
        </div>
        <div className="field">
          <label>Email</label>
          <Input
            style={{marginBottom: '20px', marginTop: '5px'}}
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <Input.Password
            style={{marginBottom: '20px', marginTop: '5px'}}
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          />
        </div>
        <div className="field">
          <label>Choose role</label>
          <Select
            value={newUser.roleId || 'Admin'}
            onChange={(value) => setNewUser({...newUser, roleId: value})}
            style={{width: '100%', marginTop: '5px'}}
          >
            <Option value="1">Admin</Option>
            <Option value="2">HR</Option>
            <Option value="3">Mentor</Option>
            <Option value="4">Fresher</Option>
          </Select>
        </div>
        {newUser.roleId === '4' && (<div className="field" style={{marginTop: '20px'}}>
          <label>Assign for mentor</label>
          <Select
            placeholder="Select mentor"
            value={newUser.mentorId || null}
            onChange={(value) => setNewUser({...newUser, mentorId: value})}
            style={{width: '100%', marginTop: '5px'}}
          >
            {mentors.map((mentor) => (<Option key={mentor.id} value={mentor.id}>
              {mentor.username}
            </Option>))}
          </Select>
        </div>)}
      </div>
    </Modal>
    <Modal
      className="modal"
      title="Send notification"
      visible={isNotificationModal}
      onOk={handleNotificationOk}
      onCancel={handleNotificationCancel}
      footer={[<Button key="back" onClick={handleNotificationCancel}>
        Cancel
      </Button>, <Button
        disabled={!notification.recipients || notification.body === '' || notification.title === ''}
        key="submit"
        type="primary"
        onClick={handleNotificationOk}
      >
        Send
      </Button>,]}
    >
      <div className="form">
        <div className="field">
          <label>Choose users</label>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            mode="multiple"
            allowClear
            style={{width: '100%', marginBottom: '20px', marginTop: '5px'}}
            placeholder="Please select"
            onChange={handleChangeUsersToSendNotification}
            value={notification.recipients}
          >
            {fullUser?.map((user) => (<Option key={user.id} value={user.id}>
              {user.username}
            </Option>))}
          </Select>
        </div>

        <div className="field">
          <label>Title</label>
          <Input
            style={{marginBottom: '20px', marginTop: '5px'}}
            value={notification.title}
            onChange={(e) => setNotification({...notification, title: e.target.value})}
          />
        </div>

        <div className="field">
          <label>Body</label>
          <TextArea
            multiline
            rows={5}
            style={{marginBottom: '20px', marginTop: '5px'}}
            value={notification.body}
            onChange={(e) => setNotification({...notification, body: e.target.value})}
          />
        </div>
      </div>
    </Modal>
  </div>);
}

export default ListUser;
