import React, { useState } from 'react';
import { VerticalDotsIcon, EducationIcon, EmptyFolderIcon, PlusIcon } from '@/assets/svg';

interface ITest {
    id: string;
    title: string;
    url: string;
}

interface TestsListProps {
    tests: Array<ITest>;
}

const TestsList: React.FC<TestsListProps> = ({ tests }) => {
    const [testsList, setTestsList] = useState<Array<ITest>>(tests);

    const handleAddTest = (test: ITest) => {
        setTestsList(currentTests => [...currentTests, test]);
    };

    return (
        <div className='mx-3 my-2'>
            {testsList.length > 0 ? (
                <div>
                    <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-4">All tests</h2>
                    <ul role="list" className="mt-3 gap-4 md:gap-6 flex flex-col">
                        {testsList.map((test, index) => (
                            <li key={test.id || index} className="flex shadow-sm rounded-md hover:shadow-gray-300 transition duration-200 ease-in-out hover:!shadow-md w-full">
                                {/* Adjusted structure for valid HTML and accessibility */}
                                <div className="flex flex-shrink-0 rounded-l-md overflow-hidden">
                                    <div className="!bg-green-500 flex items-center justify-center w-16 text-white text-sm font-medium">
                                        <div className="flex flex-col justify-center items-center">
                                            <EducationIcon aria-label="Quiz Icon" />
                                            <div className="mt-1 text-white !text-xs">Quiz</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Consider using NavLink from react-router-dom if navigation is intended */}
                                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                    <div className="flex-1 overflow-hidden group">
                                        <div className="px-4 text-sm truncate py-4 space-y-2 pb-3">
                                            <div className="text-gray-700 font-medium hover:text-gray-600 truncate text-left">{test.title}</div>
                                            <span className="text-gray-500 flex justify-start py-1 px-2 -ml-2 rounded-md items-center border border-transparent transition-all duration-200">
                                                <span className="text-gray-400 font-light">No responses</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 pr-2">
                                        <button aria-label="Open options" className="w-8 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                                            <VerticalDotsIcon />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button 
                        type="button" 
                        className="mt-2 inline-flex items-center px-3 border shadow-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-[42px] sm:h-[38px] text-sm border-transparent bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAddTest({ id: '1', title: 'New quiz', url: '/quizzes/1' })}
                    >
                        <PlusIcon />
                        <span className="max-w-full overflow-hidden">New quiz</span>
                    </button>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-10">
                    <EmptyFolderIcon />
                    <h2 className="text-gray-500 justify-center flex items-center tracking-wide mt-4 font-normal">No quizzes in workspace yet</h2>
                    <button 
                        type="button" 
                        className="mt-2 inline-flex items-center px-3 border shadow-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-[42px] sm:h-[38px] text-sm border-transparent bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAddTest({ id: '1', title: 'New quiz', url: '/quizzes/1' })}
                    >
                        <PlusIcon />
                        <span className="max-w-full overflow-hidden">New quiz</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestsList;