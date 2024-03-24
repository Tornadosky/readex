import { FC } from "react";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo/Logo";
  
interface TopBarProps {
    handleCreateSection: () => void;
    setShowSettings: (showSettings: boolean) => void;
}

  export const TopBar: FC<TopBarProps> = ({ handleCreateSection, setShowSettings }) => {
      return (
          <div className="topbar">
              <Logo />
              <div className="topbar-buttons">
                  <button className="create-section-button" onClick={handleCreateSection}>
                      {'Create new section'}
                  </button>
                  <AccountMenu username={'Username'} setShowSettings={setShowSettings} />
              </div>
          </div>
      );
  };