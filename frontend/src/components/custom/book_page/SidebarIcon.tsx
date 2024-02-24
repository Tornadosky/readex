import React from 'react';

import './style.css';

interface SidebarIconProps {
  name: string;
  icon: React.ElementType;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ name, icon: Icon }) => {
  return (
    <div style={{
      padding: '4px',
      display: 'flex', // Use flex to center the button if needed
      justifyContent: 'center', // Center horizontally
      width: '100%', // Take full width to ensure padding applies correctly on all sides
    }}>
      <button className="sidebar-icon-button" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        margin: '10px',
      }}>
        <Icon className="icon" style={{ marginBottom: '4px', width: "24px", height: "24px" }} />
        <div className="tab-label">{name}</div>
      </button>
    </div>
  );
};

export default SidebarIcon;