import { useState, useEffect, useRef, useCallback } from 'react'; 
import { MouseEvent } from 'react';
import HighlightsList from './HighlightsList'; 
import BooksList from './BooksList';
import TestsList from './tests/TestsList';
import type { IHighlight } from "./react-pdf-highlighter";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import SmallSidebar from './SmallSidebar';
import BookCreateModal from './BookCreateModal';
import axios from 'axios';
import './style.css';

interface Book {
  id: string;
  title: string;
  url?: string;
}

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const [view, setView] = useState('Books');
  const [sections, setSections] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("")
  const [booksList, setBooksList] = useState<Book[]>([]);
  const sidebarRef = useRef<HTMLElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("20vw");

  const startResizing = useCallback((mouseDownEvent: MouseEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        setSidebarWidth(
          `${mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left}px`
        );
      }
    },
    [isResizing]
  );

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const query = `
          query GetCollectionsForUser($userId: Int!) {
            Collections(user: $userId) {
              id
              title
              books {
                id
                title
              }
              user {
                id
                login
              }
            }
          }
        `;

        const variables = {
          userId: 1,
        };
        
        const response = await axios.post('http://localhost:3000/graphql', {
          query,
          variables
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const { data } = response.data;
        console.log(data);
        if (data && data.Collections) {
          setSections(data.Collections);
          setSelectedSection(data.Collections[0]);
        }
      } catch (error) {
        console.error('Failed to fetch sections:', error);
      }
    };
    const fetchBooksForUser = async () => {
      try {
        const query = `
          query GetBooksForUser($userId: Int!) {
            Books(user: $userId) {
              id
              title
            }
          }
        `;

        const variables = {
          userId: 1,
        };
        
        const response = await axios.post('http://localhost:3000/graphql', {
          query,
          variables
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const { data } = response.data;
        console.log(data);
        if (data && data.Books) {
          setBooksList(data.Books);
        }
      } catch (error) {
        console.error('Failed to fetch books for user 1:', error);
      }
    };
  
    fetchBooksForUser();
    fetchSections();
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

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

  const testTests = [
    {
      id: '1',
      title: 'GRE Official Guide',
      url: '/tests/42a4bed4-e125-4bf3-a4c0-1e66fb875b77/edit',
      questionCount: 10,
      difficulty: 'Hard',
      lastUpdated: '2023-09-01',
      lastResult: 85,
    },
    {
      id: '2',
      title: 'TOEFL Preparation Book',
      url: '/tests/54f1c2bd-ec4e-4f2e-a10e-2f639e8d8f47/edit',
      questionCount: 5,
      difficulty: 'Medium',
      lastUpdated: '2023-08-15',
      lastResult: 60,
    },
    {
      id: '3',
      title: 'GMAT Exam Guide',
      url: '/tests/e1b5b2de-3bfa-4a5b-8a9a-7e4f422c4c4e/edit',
      questionCount: 15,
      difficulty: 'Very Hard',
      lastUpdated: '2023-10-05',
      lastResult: 45,
    },
  ];
  

  return (
    <>
      <SmallSidebar
        handleViewChange={handleViewChange}
        view={view}
      />

      {isSidebarOpen && (
        <div 
          className="app-sidebar border-r" 
          style={{ width: sidebarWidth }}
          ref={sidebarRef}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="app-sidebar-content">
            <div className="submenu-header focus-visible:none border-b" style={{ backgroundColor: '#f3f3f6'}}>
              <span className="ellipsis flex items-center gap-1 mx-3">
                {view}
              </span>
              <div className="flex items-center">
                {view === 'Books' && (
                  <>
                    <PlusOutlined onClick={() => setIsModalOpen(true)} className="cursor-pointer text-gray-400 hover:text-gray-500 rounded" style={{ fontSize: '18px' }} />
                    <div className="border-l mx-2 h-5" style={{ borderColor: '#d1d5db' }}></div>
                  </>
                )}
                <CloseOutlined onClick={toggleSidebar} className="cursor-pointer mr-4 text-gray-400 hover:text-gray-500 rounded" />
              </div>
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
                  booksList={booksList}
                  setBooksList={setBooksList}
                />
              ) : view === "Tests" ? (
                <TestsList 
                  tests={testTests}
                />
              ) : (
                <BooksList 
                  booksList={booksList}
                  setBooksList={setBooksList}
                />
              )}
            </div>
          </div>

          <div className="app-sidebar-resizer" onMouseDown={startResizing} />
        </div>
      )}
      
      <BookCreateModal 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        selectedSection={selectedSection} 
        setSelectedSection={setSelectedSection}
        sections={sections}
        disabled={false}
        onSubmit={(file, newId) => {
          setBooksList((prevBooks) => [
            ...prevBooks,
            {
              id: newId,
              title: file.name.replace('.pdf', ''),
            }
          ]);
        }}
      />
    </>
  );
}