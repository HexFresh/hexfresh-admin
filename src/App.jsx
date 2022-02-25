import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Sidebar from './components/sidebar/Sidebar';
import './App.css';
import Topbar from './components/topbar/Topbar';
import { useSelector, useDispatch } from 'react-redux';
import { checkAutoLogin } from './redux/auth/auth-services';

function App() {
  const [open, setOpen] = useState(false);
  const openSidebar = () => {
    setOpen(true);
  };
  const closeSidebar = () => {
    setOpen(false);
  };
  const isLogin = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAutoLogin(dispatch, navigate, location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const authContent = (
    <>
      <Sidebar
        open={open}
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
      />
      <div className="sub">
        <Topbar openSidebar={openSidebar} />
        <Routes>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/login" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );

  const unAuthContent = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );

  const routedContent = isLogin ? authContent : unAuthContent;
  return <div className="App">{routedContent}</div>;
}

export default App;
