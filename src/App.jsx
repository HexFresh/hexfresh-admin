import React, {useState, useEffect} from 'react';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Login from './pages/login/Login';
import Sidebar from './components/sidebar/Sidebar';
import './App.css';
import Topbar from './components/topbar/Topbar';
import {useDispatch} from 'react-redux';
import ListProgram from './pages/list-program/ListProgram';
import Dashboard from './pages/dashboard/Dashboard';
import ListUser from './pages/list-user/ListUser';
import UserDetail from './pages/user-detail/UserDetail';
import UserProfile from './pages/user-profile/UserProfile';
import {Button} from 'antd';
import ProgramDetail from './pages/program-detail/ProgramDetail';
import Badges from "./pages/badges/Badges";
import {signOut} from "./redux/auth/auth-slice";
import {ErrorBoundary} from "./pages/ErrorBoundary";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
  }, []);

  const openSidebar = () => {
    setOpen(true);
  };
  const closeSidebar = () => {
    setOpen(false);
  };
  const isLogin = localStorage.getItem('userId');
  const roleId = localStorage.getItem('roleId');

  const handleLogout = () => {
    dispatch(signOut({navigate}));
  };

  const authContent = roleId === '1' || roleId === '2' ? (<>
    <Sidebar open={open} openSidebar={openSidebar} closeSidebar={closeSidebar}/>
    <div className="sub">
      <Topbar openSidebar={openSidebar}/>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboard"/>}/>
        <Route path="/login" element={<Navigate replace to="/dashboard"/>}/>
        <Route path="/programs" element={<ListProgram/>}/>
        <Route path="/programs/:programId" element={<ProgramDetail/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/users" element={<ListUser/>}/>
        <Route path="/users/:userId" element={<UserDetail/>}/>
        <Route path="/profile/:userId" element={<UserProfile/>}/>
        <Route path={"/badges"} element={<Badges/>}/>
      </Routes>
    </div>
  </>) : (<div className="no-role">
    <div className="title">You do not have permission to use this website</div>
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  </div>);

  const unAuthContent = (<Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="*" element={<Navigate replace to="/login"/>}/>
  </Routes>);

  const routedContent = isLogin ? authContent : unAuthContent;
  return (<ErrorBoundary handleError={handleLogout}>
    <div className="App">{routedContent}</div>
  </ErrorBoundary>);
}

export default App;
