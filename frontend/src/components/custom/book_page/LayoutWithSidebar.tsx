import { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from './Sidebar'; 
import './style.css';

import type { IHighlight } from "../book_page/react-pdf-highlighter";

export interface IBook {
    id: string;
    title: string;
    url?: string;
}

export interface ITest {
    id: string;
    title: string;
    questionCount: number;
    difficulty: string;
    lastUpdated: string;
    lastResult: number | null;
    questions: any[];
}

interface LayoutWithSidebarProps {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutWithSidebar = ({ isModalOpen, setIsModalOpen }: LayoutWithSidebarProps) => {
    const { pdfId } = useParams();
    const [highlights, setHighlights] = useState<IHighlight[]>([]);
    const [booksList, setBooksList] = useState<IBook[]>([]);
    const [testsList, setTestsList] = useState<ITest[]>([]);

    useEffect(() => {
        const fetchBookName = async () => {
            try {
            const response = await axios.post('http://localhost:3000/graphql', {
                query: `
                    query GetBookDetails($id: Int!) {
                        Books(id: $id) {
                        id
                        title
                        highlights {
                            id
                            text
                            color
                            title
                            emoji
                            image
                            boundingRect {
                            pagenum
                            x1
                            y1
                            x2
                            y2
                            width
                            height
                            }
                            rects {
                            rects {
                                pagenum
                                x1
                                y1
                                x2
                                y2
                                width
                                height
                            }
                            }
                        }
                        }
                    }
                `,
                variables: {
                    id: parseInt(pdfId!)
                },
            });

            if (response.data && response.data.data.Books.length > 0) {
                const book = response.data.data.Books[0];
                console.log('Book:', book);
                console.log('PDF ID:', pdfId)
                setHighlights(book.highlights.map((h: any): any => {
                    const rects = h.rects.map((r: any): any => r.rects);
                    const boundingRect = h.boundingRect;
            
                    return {
                        id: h.id,
                        content: { text: h.text, image: h.image},
                        color: h.color,
                        position: {
                            boundingRect,
                            rects,
                            pageNumber: boundingRect.pagenum
                        },
                        comment: {
                            text: h.title,
                            emoji: h.emoji
                        }
                    };
                }));
            } else {
                console.error('Book not found');
            }
            } catch (error) {
            console.error('Error fetching book name:', error);
            }
        };

        if (pdfId) {
            fetchBookName();
        }
    }, [pdfId]);
    
    const resetHighlights = () => {
        setHighlights([]);
    };

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ display: 'flex', height: '100%' }}>
                <Sidebar
                    highlights={highlights}
                    resetHighlights={resetHighlights}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    booksList={booksList}
                    setBooksList={setBooksList}
                    testsList={testsList}
                    setTestsList={setTestsList}
                />
                <Outlet context={{ booksList, setBooksList, highlights, setHighlights }}/> 
            </div>
        </div>
    );
};

export default LayoutWithSidebar;