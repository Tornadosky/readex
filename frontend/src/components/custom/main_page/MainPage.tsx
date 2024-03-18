import React, { useState, useRef, useEffect } from "react";
import { Section } from "./Sections/Section";
import { TopBar } from "./TopBar";
import Divider from '@mui/material/Divider';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertDialog } from './AlertDialog';
import MyCircularProgress from './Sections/MyCircularProgress.tsx';
import './style.css'
import { MyAlert } from "./MyAlert";

interface MainPageProps {
  userData: any;
}

interface SectionType {
  id: number; 
  section_name: string;
  books: any[]; 
}

interface ActionConfirmationType {
  id: number;
  name: string;
}

const MainPage: React.FC<MainPageProps> = ({ userData }) => {
  const sectionsContainerRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalLoading, setGlobalLoading] = useState<number>(
    parseInt(localStorage.getItem("globalLoading") || "0")
  );
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [actionConfirmation, setActionConfirmation] = useState<ActionConfirmationType>({
    id: -1,
    name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const response = await client.get("api/section/all");
        //console.log(response.data.sections);
        //setSections(response.data.sections);
        setSections([{id: 1, section_name: "Section 1", books: [{id: 1, title: "Book 1", is_processed: true, index: 0}, {id: 2, title: "Book 2", is_processed: true, index: 1}]},
        {id: 2, section_name: "Section 1", books: [{id: 1, title: "Book 1", is_processed: true, index: 0}, {id: 2, title: "Book 2", is_processed: true, index: 1}]},
        {id: 3, section_name: "Section 1", books: [{id: 1, title: "Book 1", is_processed: true, index: 0}, {id: 2, title: "Book 2", is_processed: true, index: 1}]}]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
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
      // const response = await client.post("api/section/", {
      //   section_name: "New Section"
      // });

      // if (response.data.error === 0) {
      //   const newSection = {
      //     id: response.data.section_id,
      //     section_name: response.data.section_name,
      //     books: []      
      //   };
      //   setSections([...sections, newSection]);
      // } else if (response.data.error === 2) {
      //   console.error("Limit exceeded: ", response.data.details);
      //   setOpenAlert(true);
      //   setAlertMessage("Limit exceeded: " + response.data.details);
      // } else {
      //   console.error("Failed to create section");
      //   setOpenAlert(true);
      //   setAlertMessage("Failed to create section");
      // }
      console.log("Create section");
    } catch (error) {
      console.error("Error during the API call", error);
      setOpenAlert(true);
      setAlertMessage("Error during the API call");
    }
  };

  const handleDeleteSection = async (sectionId: number | null) => {
    try {
      // const response = await client.post("api/section/delete/", {
      //   section_id: sectionId
      // });

      // if (response.status === 200) {
      //   const updatedSections = sections.filter(section => section.id !== sectionId);
      //   setSections(updatedSections);
      // } else {
      //   console.error("Failed to delete section");
      //   alert("Failed to delete section");
      // }
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div className="flex flex-col w-full bg-bgColor min-h-full">
          <MyAlert open={openAlert} setOpen={setOpenAlert} severity={"error"} message={alertMessage} />
          <TopBar userData={userData} handleCreateSection={handleCreateSection} setShowSettings={setShowSettings} />
          <AlertDialog open={open} handleClose={handleClose} actionConfirmation={actionConfirmation} type={"Section"} />
          <Divider variant="middle" className="main-divider" />
          <div ref={sectionsContainerRef}> 
            {sections.map((section) => (
              <Section 
                key={section.id}
                sectionId={section.id}
                booksList={section.books}
                name={section.section_name}
                handleDeleteSection={handleActionConfirmation}
                globalLoading={globalLoading}
                setGlobalLoading={setGlobalLoading}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default MainPage;