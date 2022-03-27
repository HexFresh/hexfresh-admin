import React, { useRef } from 'react';
import logo from '../../assets/images/logo.png';
import InputBase from '@mui/material/InputBase';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from 'antd';
import { signIn } from '../../redux/auth/auth-actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();

  const handleSignIn = () => {
    if (username.current.value !== '' && password.current.value !== '') {
      const credentials = {
        username: username.current.value,
        token: password.current.value,
      };
      dispatch(signIn(credentials, navigate));
    }
  };
  return (
    <div className="login">
      <img src={logo} alt="logo" />
      <div className="container">
        <div className="welcome">Welcome Back</div>
        <div className="sub-welcome">
          Enter the credentials to access your account
        </div>
        <div className="filed">
          <EmailIcon className="icon" />
          <InputBase
            inputRef={username}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter your username"
            autoFocus
          />
        </div>
        <div className="filed">
          <LockIcon className="icon" />
          <InputBase
            inputRef={password}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter your password"
            type="password"
          />
        </div>
        <Button onClick={handleSignIn} type="primary">
          Sign in
        </Button>
      </div>
    </div>
  );
}
