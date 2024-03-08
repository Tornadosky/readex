import { useState } from 'react';
import { HomeIcon, LogoIcon, NotesIcon, PDFIcon, TestIcon } from '@/assets/svg';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import SidebarIcon from './SidebarIcon'; 

interface SmallSidebarProps {
    handleViewChange: (newView: string) => () => void;
    view: string;
}

const SmallSidebar = ({ handleViewChange, view } : SmallSidebarProps) => {
    const [theme, setTheme] = useState('light' as 'light' | 'dark');

    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
            document.body.classList.add('dark');
        } else {
            setTheme('light');
            document.body.classList.remove('dark');
        }
    }

    return (
        <div className="small-sidebar">
            <div className="flex flex-col items-center w-16 h-full overflow-hidden text-gray-700 bg-gray-100 border-r dark:bg-slate-800 dark:text-gray-200">
                <a className="flex items-center justify-center mt-3" href="#">
                    <LogoIcon />
                </a>
                <div className="flex flex-col items-center mt-3 border-t border-gray-300 dark:border-gray-600">
                    <SidebarIcon name={'Books'} active={view === "Books"} icon={PDFIcon} onClick={handleViewChange('Books')} />
                    <SidebarIcon name={'Notes'} active={view === "Notes"} icon={NotesIcon} onClick={handleViewChange('Notes')} />
                    <SidebarIcon name={'Tests'} active={view === "Tests"} icon={TestIcon} onClick={handleViewChange('Tests')} />
                </div>
                <div className="mt-auto">
                    <a className="flex items-center justify-center w-16 h-16 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700" onClick={toggleTheme}>
                        {theme === 'light' ? (<SunOutlined style={{fontSize: "1.4rem"}} />) : (<MoonOutlined style={{fontSize: "1.4rem"}} />)}
                    </a>
                    <a className="flex items-center justify-center w-16 h-16 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-slate-900" href="/home">
                        <HomeIcon />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SmallSidebar;