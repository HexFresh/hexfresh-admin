import React from 'react';
import './status-card.css';
import {useNavigate} from "react-router-dom";

const colors = ['#EF4444', '#F97316', '#EC4899', '#0EA5E9'];

export default function StatusCard({card}) {
  const navigate = useNavigate();
  return (<div className="status-card" onClick={() => navigate('/users')}>
    <div className="container">
      <div className="left">
        <div className="name">{card.name}</div>
        <div className="number">{card.number}</div>
      </div>
      <div style={{backgroundColor: colors[card.id - 1]}} className="right">
        {card.icon}
      </div>
    </div>

    {/*<div className="bottom">*/}
    {/*  <div className="percent">*/}
    {/*    <ArrowUpwardIcon />*/}
    {/*    <span>3.48%</span>*/}
    {/*  </div>*/}
    {/*  <div className="since">Since last month</div>*/}
    {/*</div>*/}
  </div>);
}
