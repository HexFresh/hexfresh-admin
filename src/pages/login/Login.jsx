import React from 'react';
import logo from '../../assets/images/logo.png';
import InputBase from '@mui/material/InputBase';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import './login.css';

export default function Login() {
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
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter your username"
            autoFocus
          />
        </div>
        <div className="filed">
          <LockIcon className="icon" />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter your password"
            type="password"
          />
        </div>
        <Button variant="contained">Sign In</Button>
      </div>
    </div>
  );
}
