import React, {useState, useLayoutEffect, Suspense, lazy} from 'react';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import './App.css';
import Topbar from './components/topbar/Topbar';
import {useDispatch} from 'react-redux';
import {Button} from 'antd';
import {signOut} from "./redux/auth/auth-slice";
import {ErrorBoundary} from "./pages/ErrorBoundary";

const Login = lazy(() => import('./pages/login/Login'));
const ListProgram = lazy(() => import('./pages/list-program/ListProgram'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ListUser = lazy(() => import('./pages/list-user/ListUser'));
const ProgramDetail = lazy(() => import('./pages/program-detail/ProgramDetail'));
const UserProfile = lazy(() => import('./pages/user-profile/UserProfile'));
const UserDetail = lazy(() => import('./pages/user-detail/UserDetail'));
const ForgotPassword = lazy(() => import('./pages/forgot-password/ForgotPassword'));
const Badges = lazy(() => import('./pages/badges/Badges'));


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    // setAuthToken(localStorage.getItem('token'));
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
      <Suspense fallback={<p> Loading...</p>}>
        <Routes>
          <Route path="/" element={<Navigate replace to="/programs"/>}/>
          <Route path="/login" element={<Navigate replace to="/programs"/>}/>
          <Route path="/programs" element={<ListProgram/>}/>
          <Route path="/programs/:programId" element={<ProgramDetail/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/users" element={<ListUser/>}/>
          <Route path="/users/:userId" element={<UserDetail/>}/>
          <Route path="/profile/:userId" element={<UserProfile/>}/>
          <Route path={"/badges"} element={<Badges/>}/>
        </Routes>
      </Suspense>
    </div>
  </>) : (<div className="no-role">
    <div className="title">You do not have permission to use this website</div>
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  </div>);

  const unAuthContent = (<Suspense fallback={<p> Loading...</p>}><Routes>
    <Route path="/login" element={<Login/>}/>
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="*" element={<Navigate replace to="/login"/>}/>
  </Routes></Suspense>);

  const routedContent = isLogin ? authContent : unAuthContent;
  return (<ErrorBoundary handleError={handleLogout}>
    <div className="App">{routedContent}</div>
  </ErrorBoundary>);
}

export default App;
