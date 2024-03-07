import React, { useState } from 'react';
import Selector from './Selector';
import { LoadingIcon } from '@/assets/svg';

interface QuizMenuProps {
    activePage: string;
    handleSetActivePage: (page: string) => void;
    generating: boolean;
    onSubmit: (submissionData: any) => void;
}

const QuizMenu: React.FC<QuizMenuProps> = ({ activePage, handleSetActivePage, generating, onSubmit }) => {
    const [selectedQuestionType, setSelectedQuestionType] = useState("Multiple Choice");
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
    const [selectedQuestionsNumber, setSelectedQuestionsNumber] = useState(5);

    const handleSubmit = () => {
        const submissionData = {
            questionType: selectedQuestionType,
            language: selectedLanguage,
            difficulty: selectedDifficulty,
            questionsNumber: selectedQuestionsNumber,
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
                    <div className="mb-4">
                        <label className="block font-bold text-gray-800">
                            URL
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                            <input
                            type="text"
                            name="url"
                            id="url"
                            x-model="formData.url"
                            placeholder="E.g. https://en.wikipedia.org/wiki/Physics"
                            className="flex-1 block w-full min-w-0 border border-gray-300 rounded-md text-gray-800 focus:border-indigo-500 focus:ring-indigo-500 mt-1 p-2"
                            />
                        </div>
                        <div className="mt-2 text-sm">
                            The URL must be publicly accessible and not behind a login.
                        </div>
                    </div>
                
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