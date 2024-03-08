import React from 'react';

import './style.css';

interface SidebarIconProps {
  name: string;
  icon: React.ElementType;
  onClick: () => void;
  active: boolean;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ name, icon: Icon, onClick, active }) => {
  return (
    <button
      className="flex flex-col items-center justify-center w-16 h-16 mt-2 text-zinc-600 hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-gray-200"
      onClick={onClick}
      style={{ color: `${active ? 'green' : ''}` }}
    >
      <Icon />
      {name}
    </button>
  );
};

export default SidebarIcon;