import { useState } from 'react'; 
import HighlightsList from './HighlightsList'; 
import BooksList from './BooksList';
import type { IHighlight } from "./react-pdf-highlighter";
import { CloseOutlined } from '@ant-design/icons';
import SmallSidebar from './SmallSidebar';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleViewChange = (newView: string) => () => {
    if (view === newView && isSidebarOpen) {
      // If the new view is the same as the current view and the sidebar is open, toggle it
      setIsSidebarOpen(false);
    } else {
      // Otherwise, change the view and ensure the sidebar is open
      setView(newView);
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const testBooks = [
    {
      id: '1',
      title: 'GRE Official Guide',
      url: '/pdfs/42a4bed4-e125-4bf3-a4c0-1e66fb875b77/view',
    },
    {
      id: '2',
      title: 'TOEFL Preparation Book',
      url: '/pdfs/54f1c2bd-ec4e-4f2e-a10e-2f639e8d8f47/view',
    },
    {
      id: '3',
      title: 'GMAT Exam Guide',
      url: '/pdfs/e1b5b2de-3bfa-4a5b-8a9a-7e4f422c4c4e/view',
    },
  ];

  return (
    <>
      <SmallSidebar
        handleViewChange={handleViewChange}
        view={view}
      />

      {isSidebarOpen && (
        <div className="sidebar" style={{ width: "20vw" }}>
          <div className="submenu-header focus-visible:none border-b" style={{ backgroundColor: '#f3f3f6'}}>
            <span className="ellipsis flex items-center gap-1 mx-3">
              {view}
            </span>
            <CloseOutlined onClick={toggleSidebar} className="cursor-pointer mx-4 text-gray-400 hover:text-gray-500 rounded" />
          </div>
          
          <div style={{ maxHeight: 'calc(100vh - 57px)', overflowY: 'auto' }}>
            {view === 'Notes' ? (
              <HighlightsList 
                highlights={highlights}
                resetHighlights={resetHighlights}
                toggleDocument={toggleDocument}
              />
            ) : view === "Books" ? (
              <BooksList 
                books={testBooks}
              />
            ) : view === "Tests" ? (
              <div> 
                Tests
              </div>
            ) : (
              <BooksList 
                books={testBooks}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}