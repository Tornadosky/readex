import { FC } from "react";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "./Logo/Logo";

interface UserData {
    username: string;
}
  
interface TopBarProps {
    userData: UserData | null;
    handleCreateSection: () => void;
    setShowSettings: (showSettings: boolean) => void;
    client: any;
}

  export const TopBar: FC<TopBarProps> = ({ userData, handleCreateSection, setShowSettings, client }) => {
      return (
          <div className="topbar">
              <Logo />
              <div className="topbar-buttons">
                  <button className="create-section-button" onClick={handleCreateSection}>
                      {'Create new section'}
                  </button>
                  <AccountMenu username={userData ? userData.username : ''} setShowSettings={setShowSettings} client={client} />
              </div>
          </div>
      );
  };