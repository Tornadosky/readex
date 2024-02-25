import React from 'react';

import './style.css';

interface SidebarIconProps {
  name: string;
  icon: React.ElementType;
  onClick: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ name, icon: Icon, onClick }) => {
  return (
    <button className="flex flex-col items-center justify-center w-16 h-16 mt-2 rounded text-zinc-600 hover:bg-gray-300" onClick={onClick}>
      <Icon />
      {name}
    </button>
  );
};

export default SidebarIcon;