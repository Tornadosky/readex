import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from 'react-router-dom';
import { Section } from "./Sections/Section";
import { TopBar } from "./TopBar";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertDialog } from './AlertDialog';
import MyCircularProgress from './Sections/MyCircularProgress.tsx';
import { SectionType } from '../book_page/LayoutWithSidebar.tsx';
import './style.css'
import axios from 'axios';

interface MainPageProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionIdModal: number | null;
  setSectionIdModal: React.Dispatch<React.SetStateAction<number | null>>;
}

interface ActionConfirmationType {
  id: number;
  name: string;
}

interface OutletContextType {
  sections: SectionType[];
  setSections: React.Dispatch<React.SetStateAction<SectionType[]>>;
  setBooksList: (value: any) => void;
}

const MainPage: React.FC<MainPageProps> = ({ isModalOpen, setIsModalOpen, sectionIdModal, setSectionIdModal }) => {
  const sectionsContainerRef = useRef<HTMLDivElement>(null);
  const { sections, setSections, setBooksList } = useOutletContext<OutletContextType>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalLoading, setGlobalLoading] = useState<number>(
    parseInt(localStorage.getItem("globalLoading") || "0")
  );

  const [actionConfirmation, setActionConfirmation] = useState<ActionConfirmationType>({
    id: -1,
    name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/graphql', {
          query: `
            query GetAllCollections {
              Collections(user: 1) {
                id
                title
                books {
                  books {
                    id
                    title
                    image
                  }
                }
              }
            }
          `,
        });
        const data = response.data.data.Collections || [];

        console.log(data);
        setSections(data.map((section: any) => ({
          id: section.id,
          title: section.title,
          books: section.books.map((book: any, index: number) => ({
            id: book.books.id,
            title: book.books.title,
            index: index,
            cover_image: book.books.image.replace("./uploads/", ''),
          })),
        }))
        );
        
        // setSections([{id: 1, section_name: "Section 1", books: [{id: 1, title: "Book 1", is_processed: true, index: 0}, {id: 2, title: "Book 2", is_processed: true, index: 1}]},
        // {id: 2, section_name: "Section 1", books: [{id: 1, title: "Book 1", is_processed: true, index: 0}, {id: 2, title: "Book 2", is_processed: true, index: 1}]},
        // {id: 3, section_name: "Section 1", books: [{id: 1, title: "Book 1", is_processed: true, index: 0}, {id: 2, title: "Book 2", is_processed: true, index: 1}]}]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    console.log("Fetching data")
  
    fetchData();
  }, []);

  const handleActionConfirmation = (id: any, name: string) => {
    setActionConfirmation({ id, name });
    setOpen(true);
  };

  const handleClose = (confirmed: boolean) => {
    setOpen(false);
    const { id, name } = actionConfirmation;

    if (confirmed) {
      handleDeleteSection(id);
    }

    setActionConfirmation({ id: -1, name: name });
  };

  const handleCreateSection = async () => {
    try {
      const mutation = `
        mutation SetCollection($title: String!, $user: Int!) {
          setCollection(title: $title, user: $user) {
            id
            title
          }
        }
      `;

      const variables = {
        title: "New Section",
        user: 1, 
      };

      const response = await axios.post('http://localhost:3000/graphql', {
        query: mutation,
        variables,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.data && response.data.data.setCollection) {
        const newSection = {
          id: response.data.data.setCollection.id,
          title: response.data.data.setCollection.title,
          books: []
        };
        setSections([...sections, newSection]);
      } else {
        console.error("Failed to create section");
        alert("Failed to create section");
      }
      console.log("Create section");
    } catch (error) {
      console.error("Error during the API call", error);
      alert("Error during the API call");
    }
  };

  const handleDeleteSection = async (sectionId: any) => {
    try {
      const mutation = `
        mutation DelCollection($id: Int!) {
          delCollection(id: $id) {
            id
          }
        }
      `;
      console.log(sectionId);

      const variables = {
        id: parseInt(sectionId),
      };

      const response = await axios.post('http://localhost:3000/graphql', {
        query: mutation,
        variables,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && !response.data.errors) {
        setSections(sections => sections.filter(section => section.id !== sectionId));
      } else {
        console.error("Failed to delete section");
        alert("Failed to delete section");
      }
      console.log("Delete section");
    } catch (error) {
      console.error("Error during the API call", error);
      alert("Error during the API call");
    }
  };

  useEffect(() => {
    if (sectionsContainerRef.current && sectionsContainerRef.current.lastChild) {
      const newSection = sectionsContainerRef.current.lastChild as HTMLElement;
      const topPos = newSection.offsetTop + newSection.offsetHeight;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  }, [sections]);

  // if (loading) {
  //   console.log("Loading");
  //   return (
  //     <div className="loading-center">
  //         <MyCircularProgress determinate={false}/>
  //     </div>
  //   );
  // }

  useEffect(() => {
    console.log("Sections Updated: ", sections);
  }, [sections]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div className="flex flex-col w-full bg-bgColor dark:bg-slate-800 min-h-full">
          <TopBar handleCreateSection={handleCreateSection} />
          <AlertDialog open={open} handleClose={handleClose} actionConfirmation={actionConfirmation} type={"Section"} />
          <div className="pt-14" ref={sectionsContainerRef} > 
            {sections.map((section) => (
              <Section 
                key={section.id}
                sectionId={section.id}
                booksList={section.books}
                setSections={setSections}
                setBooksList={setBooksList}
                name={section.title}
                handleDeleteSection={handleActionConfirmation}
                globalLoading={globalLoading}
                setGlobalLoading={setGlobalLoading}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                sectionIdModal={sectionIdModal}
                setSectionIdModal={setSectionIdModal}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default MainPage;