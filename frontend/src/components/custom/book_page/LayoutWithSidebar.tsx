import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar'; 
import './style.css';

import type { IHighlight } from "../book_page/react-pdf-highlighter";

interface LayoutWithSidebarProps {
    highlights: IHighlight[];
    resetHighlights: () => void;
    toggleDocument: () => void;
}

const LayoutWithSidebar = ({highlights, resetHighlights, toggleDocument}: LayoutWithSidebarProps) => {
    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ display: 'flex', height: '100%' }}>
                <Sidebar 
                    highlights={highlights}
                    resetHighlights={resetHighlights}
                    toggleDocument={toggleDocument}
                />
                <Outlet /> 
            </div>
        </div>
    );
};

export default LayoutWithSidebar;