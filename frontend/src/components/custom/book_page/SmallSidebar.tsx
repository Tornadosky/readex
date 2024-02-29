import { HomeIcon, LogoIcon, NotesIcon } from '@/assets/svg';
import SidebarIcon from './SidebarIcon'; 

interface SmallSidebarProps {
    handleViewChange: (newView: string) => () => void;
    view: string;
}

const SmallSidebar = ({ handleViewChange, view } : SmallSidebarProps) => {
    return (
        <div className="small-sidebar">
            <div className="flex flex-col items-center w-16 h-full overflow-hidden text-gray-700 bg-gray-100 rounded border-r">
                <a className="flex items-center justify-center mt-3" href="#">
                <LogoIcon />
                </a>
                <div className="flex flex-col items-center mt-3 border-t border-gray-300">
                <SidebarIcon name={'Home'} active={view === "Home"} icon={HomeIcon} onClick={handleViewChange('Home')} />
                <SidebarIcon name={'Notes'} active={view === "Notes"} icon={NotesIcon} onClick={handleViewChange('Notes')} />
                <SidebarIcon name={'Tests'} active={view === "Tests"} icon={NotesIcon} onClick={handleViewChange('Tests')} />
                </div>
                <a className="flex items-center justify-center w-16 h-16 mt-auto bg-gray-200 hover:bg-gray-300" href="#">
                <HomeIcon />
                </a>
            </div>
        </div>
    );
}

export default SmallSidebar;