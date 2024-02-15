import { LogoSVG } from '../../../../assets/svg';
import './style.css';

export const Logo = () => {
  return (
    <div className="logo-main">
      <div className="logo-container-main">
        <LogoSVG />
        <div className="logo-text-main">Easy Knowledge</div>
      </div>
    </div>
  );
};