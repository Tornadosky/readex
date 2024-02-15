import React from "react";

interface IconProps {
  name: string;
  src: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Icon: React.FC<IconProps> = ({ name, src, onClick }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div className={name} onClick={handleClick}>
      <img className={`icon ${name}`} alt={`Icon ${name}`} src={src} />
    </div>
  );
};