import React from 'react';

export default function SidebarItem({ route, active, hide }) {
  const act = active ? 'active' : '';
  return (
    <div className={`sidebar-item ${act} ${hide}`}>
      <div className={`sidebar-item-icon ${act}`}>{route.icon}</div>
      <span className={hide ? 'hidename' : 'name'}>{route.display_name}</span>
    </div>
  );
}
