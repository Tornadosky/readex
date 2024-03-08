import React, { useState } from 'react';
import { VerticalDotsIcon, EducationIcon, EmptyFolderIcon, PlusIcon } from '@/assets/svg';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface ITest {
    id: string;
    title: string;
    url: string;
    questionCount: number;
    difficulty: string;
    lastUpdated: string;
    lastResult: number | null;
}

interface TestsListProps {
    tests: Array<ITest>;
}

const TestsList: React.FC<TestsListProps> = ({ tests }) => {
    const [testsList, setTestsList] = useState<Array<ITest>>(tests);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

    const navigate = useNavigate()

    const handleAddTest = (test: ITest) => {
        setTestsList(currentTests => [...currentTests, test]);
    };

    const AddQuizButton: React.FC = () => {
        return (
            <button 
                type="button" 
                className="mt-4 inline-flex items-center px-3 border shadow-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-[42px] sm:h-[38px] text-sm border-transparent bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAddTest({ id: testsList.length.toString() + Math.floor(Math.random() * 1000).toString(), title: 'New Quiz', url: 'http://localhost:5173/tests/new', questionCount: 0, difficulty: 'easy', lastUpdated: '2021-09-01', lastResult: 0 })}
            >
                <PlusIcon />
                <span className="max-w-full overflow-hidden">New quiz</span>
            </button>
        );
    }

    const handleDotsClick = (testId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevents the default action (navigation)
        event.stopPropagation(); // Stops the click event from propagating to the parent <a> tag
        setSelectedTestId(testId); // Set the selected test ID
    };
  
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
        if (e.key === '2' && selectedTestId) { // If "Delete" is clicked
            setTestsList(currentTests => currentTests.filter(test => test.id !== selectedTestId));
            setSelectedTestId(null);
        } 
        if (e.key === '1' && selectedTestId) { // If "Edit" is clicked
            const testToEdit = testsList.find(test => test.id === selectedTestId);
            if (testToEdit) {
                navigate(`/tests/${selectedTestId}/edit`);
            }
        }
    };

    const items: MenuProps['items'] = [
        {
            label: 'Edit',
            key: '1',
            icon: <EditOutlined style={{ fontSize: "1rem" }} />,
        },
        {
            label: 'Delete',
            key: '2',
            icon: <DeleteOutlined style={{ fontSize: "1rem" }} />,
            danger: true,
        },
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <div className='mx-3 my-2'>
            {testsList.length > 0 ? (
                <div>
                    <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-4">All tests</h2>
                    <ul role="list" className="mt-3 gap-4 md:gap-6 flex flex-col">
                        {testsList.map((test, index) => (
                            <li key={test.id || index} className="flex shadow-sm rounded-md hover:shadow-gray-300 transition duration-200 ease-in-out hover:!shadow-md w-full">
                                <div 
                                    className="flex flex-shrink-0 rounded-l-md overflow-hidden cursor-pointer"
                                    onClick={() => navigate(`/tests/${test.id}/play`)}
                                >
                                    <div className={`flex items-center justify-center w-16 text-white text-sm font-medium ${test.lastResult ? (test.lastResult >= 80 ? '!bg-green-500' : test.lastResult >= 50 ? '!bg-yellow-500' : '!bg-red-500') : '!bg-zinc-500'}`}>
                                        <div className="flex flex-col justify-center items-center">
                                            <EducationIcon aria-label="Quiz Icon" />
                                            <div className="mt-1 text-white !text-xs">Quiz</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                    <div className="flex-1 overflow-hidden group">
                                        <div className="px-4 text-sm truncate py-4 space-y-2 pb-3">
                                            <div className="text-gray-700 font-medium hover:text-gray-600 truncate text-left">
                                                {test.title}
                                                <span className={`ml-4 inline-flex text-xs text-gray-700 leading-5 font-semibold`}>
                                                    {test.questionCount.toString()} {test.questionCount === 1 ? 'question' : 'questions'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500">Difficulty: {test.difficulty}</span>
                                                {/* <span className="text-gray-500">Last Updated: {test.lastUpdated}</span> */}
                                                <span className={`px-2 ml-2 inline-flex text-xs leading-5 font-semibold rounded-full ${test.lastResult ? (test.lastResult >= 80 ? 'bg-green-100 text-green-800' : test.lastResult >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') : '!bg-zinc-200'}`}>
                                                    Result: {test.lastResult ? test.lastResult : "NA"}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 pr-2">
                                        <Dropdown menu={menuProps} trigger={['click']}>
                                            <button 
                                                aria-label="Open options" 
                                                className="w-4 inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-600 focus:outline-none cursor-pointer"
                                                onClick={handleDotsClick(test.id)}
                                            >
                                                <VerticalDotsIcon />
                                            </button>
                                        </Dropdown>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <AddQuizButton />
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-10">
                    <EmptyFolderIcon />
                    <h2 className="text-gray-500 justify-center flex items-center tracking-wide mt-4 font-normal">No quizzes in workspace yet</h2>
                    <AddQuizButton />
                </div>
            )}
        </div>
    );
};

export default TestsList;