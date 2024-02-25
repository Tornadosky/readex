import React, { useState } from 'react'; 
import SidebarIcon from './SidebarIcon'; 
import HighlightsList from './HighlightsList'; 
import type { IHighlight } from "./react-pdf-highlighter";

import { HomeIcon, LogoIcon, NotesIcon } from '@/assets/svg';

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
}: Props) {
  const [view, setView] = useState('Home');

  const handleViewChange = (newView: string) => () => {
    setView(newView);
  };

  return (
    <>
      <div className="flex flex-col items-center w-16 h-full overflow-hidden text-gray-700 bg-gray-100 rounded border-r">
        <a className="flex items-center justify-center mt-3" href="#">
          <LogoIcon />
        </a>
        <div className="flex flex-col items-center mt-3 border-t border-gray-300">
          <SidebarIcon name={'Home'} icon={HomeIcon} onClick={handleViewChange('Home')} />
          <SidebarIcon name={'Notes'} icon={NotesIcon} onClick={handleViewChange('Notes')}/>
        </div>
        <a className="flex items-center justify-center w-16 h-16 mt-auto bg-gray-200 hover:bg-gray-300" href="#">
          <HomeIcon />
        </a>
      </div>
      <div className="sidebar" style={{ width: "25vw" }}>
        <div className="submenu-header focus-visible:none border-b" style={{ backgroundColor: '#f3f3f6'}}>
          <span className="ellipsis flex items-center gap-1 mx-3">
            {view}
          </span>
        </div>

        {view === 'Notes' ? (
          <HighlightsList 
            highlights={highlights}
            resetHighlights={resetHighlights}
            toggleDocument={toggleDocument}
          />
        ) : view === "Books" ? (
          <div>
            Books
          </div>
        ) : (
          <div>
            Home
          </div>
        )}
      </div>
    </>
  );
}