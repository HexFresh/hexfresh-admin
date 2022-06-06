import React, {useRef, useEffect, useState} from 'react';
import logo from '../../assets/images/logo.png';
import InputBase from '@mui/material/InputBase';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {Button, notification, Spin} from 'antd';
import {useDispatch} from 'react-redux';
import {useNavigate} from "react-router-dom";
import './login.css';
import {signIn} from "../../redux/auth/auth-slice";
import {signInService} from "../../redux/auth/auth-services";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();

  useEffect(() => {
    document.title = 'Login';
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
    setLoading(true);
    if (username.current.value !== '' && password.current.value !== '') {
      const credentials = {
        username: username.current.value, password: password.current.value,
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

  return (<div className="login">
    <img src={logo} alt="logo"/>
    <div className="container">
      <div className="welcome">Welcome Back</div>
      <div className="sub-welcome">Enter the credentials to access your account</div>
      <div className="filed">
        <EmailIcon className="icon"/>
        <InputBase inputRef={username} sx={{ml: 1, flex: 1}} placeholder="Enter your username" autoFocus/>
      </div>
      <div className="filed">
        <LockIcon className="icon"/>
        <InputBase inputRef={password} sx={{ml: 1, flex: 1}} placeholder="Enter your password" type="password"/>
      </div>
      <p className={"f-password"} onClick={() => navigate("/forgot-password")}>Forgot your password?</p>
      <Button onClick={handleSignIn}>
        {loading ? (<Spin/>) : <span>Sign In</span>}
      </Button>
    </div>
  </div>);
}
