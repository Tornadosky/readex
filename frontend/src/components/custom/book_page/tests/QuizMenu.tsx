import React, { useState, useEffect } from 'react';
import Selector from '../Selector';
import { LoadingIcon } from '@/assets/svg';
import axios from 'axios';

interface Book {
    id: string;
    title: string;
}

interface QuizMenuProps {
    activePage: string;
    handleSetActivePage: (page: string) => void;
    generating: boolean;
    onSubmit: (submissionData: any) => void;
}

const QuizMenu: React.FC<QuizMenuProps> = ({ activePage, handleSetActivePage, generating, onSubmit }) => {
    const [selectedQuestionType, setSelectedQuestionType] = useState<string>("Multiple Choice");
    const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Easy");
    const [selectedQuestionsNumber, setSelectedQuestionsNumber] = useState<number>(5);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.post('http://localhost:3000/graphql', {
                    query: `
                        query {
                            Books {
                                id
                                title
                            }
                        }
                    `
                });
                if (response.data.data && response.data.data.Books.length > 0) {
                    setBooks(response.data.data.Books);
                    setSelectedBook(response.data.data.Books[0]);
                }
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        };

        fetchBooks();
    }, []);

    const handleSubmit = () => {
        const submissionData = {
            question_type: selectedQuestionType,
            language: selectedLanguage,
            difficulty: selectedDifficulty,
            question_number: 2,//selectedQuestionsNumber,
            //bookId: selectedBook?.id
            text: "Adoption of 3D printing has reached critical mass as those who have yet to integrate additive manufacturing somewhere in their supply chain are now part of an ever-shrinking minority. Where 3D printing was only suitable for prototyping and one-off manufacturing in the early stages, it is now rapidly transforming into a production technology. Most of the current demand for 3D printing is industrial in nature. Acumen Research and Consulting forecasts the global 3D printing market to reach $41 billion by 2026. As it evolves, 3D printing technology is destined to transform almost every major industry and change the way we live, work, and play in the future."
        };
        onSubmit(submissionData);
    };

    return (
        <>
            <div className="text-sm m-2 font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                {['Text', 'Uploads', 'URL', 'Manual'].map((item) => (
                    <li key={item} className="me-2">
                        <div
                        onClick={() => handleSetActivePage(item)}
                        className={`inline-block p-4 border-b-2 cursor-pointer ${activePage === item ? 'text-blue-600 border-blue-600' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'} rounded-t-lg`}
                        >
                        {item}
                        </div>
                    </li>
                ))}
                </ul>
            </div>
            {/* Conditional content rendering based on activePage state */}
            <div className='p-3'>
                {activePage === 'Uploads' && <div>Uploads Content</div>}
                {activePage === 'Text' && <div>Text Content</div>}
                {activePage === 'URL' && (
                <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-bold text-gray-800">
                                Section
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <Selector 
                                    options={['Multiple Choice', 'True or False', 'Short Answer', 'Fill in the Blank', 'Matching']}
                                    selected={selectedQuestionType}
                                    setSelected={setSelectedQuestionType}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-bold text-gray-800">
                                Book Name
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <Selector
                                    options={books.map(book => book.title)}
                                    selected={selectedBook?.title || ''}
                                    setSelected={(value) => setSelectedBook(books.find(book => book.title === value) ?? null)}
                                    disabled={books.length === 0}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='border-b border-gray-200 dark:border-gray-700 mt-8 mb-7'></div>
                
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-gray-800">
                                Question type
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <Selector 
                                    options={['Multiple Choice', 'True or False', 'Short Answer', 'Fill in the Blank', 'Matching']}
                                    selected={selectedQuestionType}
                                    setSelected={setSelectedQuestionType}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-bold text-gray-800">
                                Language
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <Selector 
                                    options={['English', 'Spanish', 'French', 'German', 'Italian', 'Russian']}
                                    selected={selectedLanguage}
                                    setSelected={setSelectedLanguage}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-bold text-gray-800">
                                Difficulty
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <Selector 
                                    options={['Easy', 'Medium', 'Hard']}
                                    selected={selectedDifficulty}
                                    setSelected={setSelectedDifficulty}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block font-bold text-gray-800">
                                Questions
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <Selector
                                    options={['5', '10', '15', '20', '25']}
                                    selected={selectedQuestionsNumber.toString()}
                                    setSelected={(value) => setSelectedQuestionsNumber(parseInt(value))}
                                    disabled={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        {generating ? (
                            <button 
                                disabled 
                                type="button" 
                                className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex justify-center items-center"
                            >
                                <LoadingIcon />
                                Loading...
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex justify-center items-center"
                                onClick={handleSubmit}
                            >
                                Generate
                            </button>
                        )}
                    </div>
                </div>
                )}
                {activePage === 'Manual' && <div>Manual Content</div>}
            </div>
        </>
    );
};

export default QuizMenu;