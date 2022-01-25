import React from 'react';
import './notifications.css';

export default function Notifications({ open }) {
  const active = open === true ? 'active' : '';

  return (
    <div className={`notifications ${active}`}>
      <div className="noti-container">Notification</div>
    </div>
  );
}
