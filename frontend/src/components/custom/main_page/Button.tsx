import React from "react";
import "./style.css";

interface ButtonProps {
  string: string;
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({ string, icon }) => {
  return (
    <div className="button">
      {icon && <img src={icon} alt="Button Icon" />}
      <div className="text-wrapper-3">{string}</div>
    </div>
  );
};

export default Button;