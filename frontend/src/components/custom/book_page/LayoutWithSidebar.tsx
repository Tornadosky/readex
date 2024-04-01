import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar'; 
import './style.css';

import type { IHighlight } from "../book_page/react-pdf-highlighter";

export interface IBook {
    id: string;
    title: string;
    url?: string;
}

interface LayoutWithSidebarProps {
    highlights: IHighlight[];
    resetHighlights: () => void;
    toggleDocument: () => void;
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutWithSidebar = ({highlights, resetHighlights, toggleDocument, isModalOpen, setIsModalOpen }: LayoutWithSidebarProps) => {
    const [booksList, setBooksList] = useState<IBook[]>([]);

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ display: 'flex', height: '100%' }}>
                <Sidebar 
                    highlights={highlights}
                    resetHighlights={resetHighlights}
                    toggleDocument={toggleDocument}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    booksList={booksList}
                    setBooksList={setBooksList}
                />
                <Outlet context={{ booksList, setBooksList }}/> 
            </div>
        </div>
    );
};

export default LayoutWithSidebar;