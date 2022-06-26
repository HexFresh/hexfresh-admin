import React, {useRef, useEffect, useState} from 'react';
import logo from '../../assets/images/logo.png';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {Button, notification, Spin, Input} from 'antd';
import {useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import './login.css';
import {signIn} from "../../redux/auth/auth-slice";
import {signInService} from "../../redux/auth/auth-services";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'HexAd - Login';
  }, []);

  const openFailedNotification = (placement) => {
    notification.error({
      message: `Login failed`, description: 'Invalid username or password', placement, duration: 2
    });
  };

  const openSuccessNotification = (placement) => {
    notification.success({
      message: `Login success`, placement, duration: 2,
    });
  };

  const handleSignIn = async () => {
    if (username === '' || password === '') {
      openFailedNotification('topRight');
    } else {
      setLoading(true);

      const credentials = {
        username, password,
      };
      const user = await signInService(credentials);
      if (user) {
        dispatch(signIn({credentials, navigate}));
        openSuccessNotification('topRight');
        setLoading(false);
      } else {
        openFailedNotification('topRight');
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  }

  return (<div className="login">
    <img src={logo} alt="logo"/>
    <div className="container">
      <div className="welcome">Welcome Back</div>
      <div className="sub-welcome">Enter the credentials to access your account</div>
      <div className="filed">
        <Input onKeyDown={handleKeyDown} onChange={(e) => setUsername(e.target.value)} size="large"
               prefix={<EmailIcon className="icon"/>} value={username}
               placeholder="Enter your username" autoFocus/>
      </div>
      <div className="filed">
        <Input.Password onKeyDown={handleKeyDown} onChange={(e) => setPassword(e.target.value)} size="large"
                        prefix={<LockIcon className="icon"/>} value={password}
                        placeholder="Enter your password"/>
      </div>
      <p className={"f-password"} onClick={() => navigate("/forgot-password")}>Forgot your password?</p>
      <Button onClick={handleSignIn}>
        {loading ? (<Spin/>) : <span>Sign In</span>}
      </Button>
    </div>
  </div>);
}
