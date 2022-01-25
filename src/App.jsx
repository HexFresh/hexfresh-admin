import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Sidebar from './components/sidebar/Sidebar';
import './App.css';
import Topbar from './components/topbar/Topbar';

function App() {
  const isLogin = true;
  const authContent = (
    <>
      <Sidebar />
      <div className="sub">
        <Topbar />
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
