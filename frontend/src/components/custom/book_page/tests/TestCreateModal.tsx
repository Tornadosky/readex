import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CloseOutlined } from '@ant-design/icons';
import Selector from '../Selector';
import axios from 'axios';
import { LoadingIcon } from '@/assets/svg';
import { Select } from 'antd';


interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  booksList: Array<any>; 
  onSubmit: (newTest: any) => void;
}

const TestCreateModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen, booksList, onSubmit }) => {
    const [selectedBook, setSelectedBook] = useState<any>(booksList[0]); // Adapt this state as per your actual book type
    const [questionSource, setQuestionSource] = useState<'pdf' | 'highlights'>('pdf');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
    const [selectedQuestionType, setSelectedQuestionType] = useState<string>('Multiple Choice');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClosed = () => {
        setIsModalOpen(false);
    }

    console.log('booksList:', booksList.map(book => book.title));
    console.log('selectedBook:', selectedBook);

    const handleSubmit = async () => {
        // Here, you might want to call a backend endpoint to create a test
        // For demonstration, let's assume the backend requires selectedBook's ID and questionSource
        setIsSubmitting(true);
        
        try {
            const response = await axios.post('http://localhost:3000/graphql', {
                query: `
                mutation CreateTest($title: String!, $questionCount: Int!, $difficulty: String!, $language: String!, $prompt: String!, $user: Int!) {
                    setTest(title: $title, questionCount: $questionCount, difficulty: $difficulty, language: $language, prompt: $prompt, user: $user) {
                        id
                        title
                        questionCount
                        difficulty
                        lastResult
                    }
                }
                `,
                variables: {
                    // bookId: selectedBook.id,
                    // source: questionSource,
                    title: 'Test Title',
                    questionCount: 0,
                    difficulty: 'Easy',
                    language: 'English',
                    prompt: 'Test prompt',
                    user: 1,
                }
            });

            if (response.data.data && !response.data.errors) {
                console.log('Test created:', response.data.data.setTest);
                onSubmit(response.data.data.setTest);
                setIsModalOpen(false);
            } else {
                console.error('Failed to create test:', response.data.errors);
            }
        } catch (error) {
            console.error('Error creating test:', error);
        } finally {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleClosed}>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" style={{ minWidth: "70vh" }}>
                        <div className='absolute top-2 right-4 '>
                            <CloseOutlined onClick={handleClosed} className="cursor-pointer text-gray-400 hover:text-gray-500 rounded" />
                        </div>
                        <div>
                            <label className="block font-bold mb-2 text-gray-800">
                                Book
                            </label>
                            <Selector 
                                options={booksList.map((book) => book.title)}
                                selected={selectedBook.title}
                                setSelected={(value) => setSelectedBook(booksList.find(book => book.title === value) || booksList[0])}
                                disabled={false}
                            />
                        </div>

                        <div className="border-b mt-5 mb-3 w-full" style={{ borderColor: '#d1d5db' }}></div>

                        <div className='flex justify-center align-middle'>
                            <label className='mr-16'>
                                <input
                                    className='mx-2' 
                                    type="radio" 
                                    name="questionSource" 
                                    value="pdf" 
                                    checked={questionSource === 'pdf'} 
                                    onChange={() => setQuestionSource('pdf')} 
                                />
                                PDF
                            </label>
                            <label>
                                <input 
                                    className='mx-2' 
                                    type="radio" 
                                    name="questionSource" 
                                    value="highlights" 
                                    checked={questionSource === 'highlights'} 
                                    onChange={() => setQuestionSource('highlights')} 
                                />
                                Highlights
                            </label>
                        </div>

                        <div className="border-b mt-5 mb-3 w-full" style={{ borderColor: '#d1d5db' }}></div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block font-bold text-gray-800">
                                    Question Type
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <Select
                                        disabled
                                        defaultValue={selectedQuestionType}
                                        style={{ minWidth: "100%" }}
                                        onChange={(value) => setSelectedQuestionType(value)}
                                        options={[
                                            { value: 'Multiple Choice', label: 'Multiple Choice' },
                                            { value: 'True or False', label: 'True or False' },
                                            { value: 'Short Answer', label: 'Short Answer' },
                                            { value: 'Fill in the Blank', label: 'Fill in the Blank' },
                                            { value: 'Matching', label: 'Matching' },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold text-gray-800">
                                    Language
                                </label>
                                <div className="mt-1 rounded-md shadow-sm">
                                    <Select
                                        defaultValue={selectedLanguage}
                                        style={{ minWidth: "100%" }}
                                        onChange={(value: string) => setSelectedLanguage(value)}
                                        options={[
                                            { value: 'English', label: 'English' },
                                            { value: 'Spanish', label: 'Spanish' },
                                            { value: 'German', label: 'German' },
                                            { value: 'Russian', label: 'Russian' },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        

                        <div className="mt-4">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !selectedBook || !questionSource}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingIcon />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    );
};

export default TestCreateModal;
