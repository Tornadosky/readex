import { useState, useEffect, useRef, useCallback } from 'react'; 
import { MouseEvent } from 'react';
import HighlightsList from './HighlightsList'; 
import BooksList from './BooksList';
import TestsList from './tests/TestsList';
import type { IHighlight } from "./react-pdf-highlighter";
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import SmallSidebar from './SmallSidebar';
import BookCreateModal from './BookCreateModal';
import type { IBook, ITest } from './LayoutWithSidebar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { SectionType } from './LayoutWithSidebar';
import './style.css';
import PricingPlanModal from './PricingPlanModal';

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  booksList: Array<IBook>;
  setBooksList: (value: any) => void;
  testsList: Array<ITest>;
  setTestsList: (value: any) => void;
  sectionIdModal: number | null;
  setSectionIdModal: React.Dispatch<React.SetStateAction<number | null>>;
  sections: Array<SectionType>;
  setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
}

export function Sidebar({
  highlights,
  resetHighlights,
  isModalOpen,
  setIsModalOpen,
  booksList,
  setBooksList,
  testsList,
  setTestsList,
  sectionIdModal,
  setSectionIdModal,
  sections,
  setSections,
}: Props) {
  const [view, setView] = useState('Books');
  //const [sections, setSections] = useState([]);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("20vw");
  const { pdfId } = useParams();

  const startResizing = useCallback((mouseDownEvent: MouseEvent) => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: globalThis.MouseEvent) => {
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
                books {
                  id
                  title
                }
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
          //setSections(data.Collections);
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
    const fetchTestsForUser = async () => {
      try {
        const query = `
          query GetTestsForUser($userId: Int!) {
            Tests(user: $userId) {
              id
              title
              prompt
              language
              difficulty
              questionCount
              lastResult
              questions {
                id
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
        if (data && data.Tests) {
          setTestsList(data.Tests.map((test: ITest) => ({
            id: test.id,
            title: test.title,
            questionCount: test.questions.length,
            difficulty: test.difficulty,
            lastUpdated: '2021-09-01',
            lastResult: test.lastResult,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch tests for user:', error);
      }
    };
    
    fetchTestsForUser();
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
    if (isSidebarOpen) {
      setView('');
    }
    setIsSidebarOpen(!isSidebarOpen);
  };  

  return (
    <>
      <SmallSidebar
        setIsPricingModalOpen={setIsPricingModalOpen}
        handleViewChange={handleViewChange}
        view={view}
      />

      {isSidebarOpen && (
        <div 
          className="app-sidebar border-r dark:border-gray-600" 
          style={{ width: sidebarWidth }}
          ref={sidebarRef}
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="app-sidebar-content dark:bg-slate-800">
            {/* <div className="submenu-header focus-visible:none border-b dark:bg-gray-400">  style={{ backgroundColor: '#f3f3f6'}}> */}
            <div className="submenu-header focus-visible:none border-b dark:border-gray-600 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-200"> 
              <span className="ellipsis flex items-center gap-1 mx-3">
                {view}
              </span>
              <div className="flex items-center">
                {view === 'Books' && (
                  <>
                    <PlusOutlined onClick={() => {setSectionIdModal(null); setIsModalOpen(true)}} className="cursor-pointer text-gray-400 hover:text-gray-500 rounded" style={{ fontSize: '18px' }} />
                    <div className="border-l mx-2 h-5 border-gray-300 dark:border-gray-600"></div>
                  </>
                )}
                <CloseOutlined onClick={toggleSidebar} className="cursor-pointer mr-4 text-gray-400 hover:text-gray-500 rounded" />
              </div>
            </div>
            
            <div className='' style={{ maxHeight: 'calc(100vh - 57px)', overflowY: 'auto' }}>
              {view === 'Notes' ? (
                <HighlightsList 
                  bookId={pdfId}
                  highlights={highlights}
                  resetHighlights={resetHighlights}
                />
              ) : view === "Books" ? (
                <BooksList 
                  booksList={booksList}
                  setBooksList={setBooksList}
                />
              ) : view === "Tests" ? (
                <TestsList 
                  booksList={booksList}
                  testsList={testsList}
                  setTestsList={setTestsList}
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
        sectionIdModal={sectionIdModal}
        setIsModalOpen={setIsModalOpen} 
        selectedSection={selectedSection} 
        setSelectedSection={setSelectedSection}
        sections={sections}
        setSections={setSections}
        onSubmit={(file, newId) => {
          setBooksList((prevBooks: any) => [
            ...prevBooks,
            {
              id: newId,
              title: file.name.replace('.pdf', ''),
            }
          ]);
        }}
      />
      
      <PricingPlanModal
        isOpen={isPricingModalOpen}
        setIsOpen={setIsPricingModalOpen}
        onSubmit={(selectedPlan) => {
          console.log(selectedPlan);
        }}
      />
    </>
  );
}