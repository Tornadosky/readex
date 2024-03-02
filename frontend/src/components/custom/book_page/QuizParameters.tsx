import { useState } from 'react';
import QuestionCard from './QuestionCard';



const QuizParameters = () => {
  const [activePage, setActivePage] = useState('Uploads');

  const handleSetActivePage = (page: string) => {
    setActivePage(page);
  };

  // Render the component UI
  return (
    <div className="flex p-4 h-full">
      <div className='p-4 h-full bg-gray-50' style={{ width: '50%'}}>
        <div className="text-sm m-2 font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <a
                        href="#"
                        onClick={() => handleSetActivePage('Text')}
                        className={`inline-block p-4 border-b-2 ${activePage === 'Text' ? 'text-blue-600 border-blue-600' : 'border-transparent'} rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    >
                        Text
                    </a>
                </li>
                <li className="me-2">
                    <a
                        href="#"
                        onClick={() => handleSetActivePage('Uploads')}
                        className={`inline-block p-4 ${activePage === 'Uploads' ? 'text-blue-600 border-blue-600' : 'border-transparent'} rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                        aria-current="page"
                    >
                        Uploads
                    </a>
                </li>
                <li className="me-2">
                    <a
                        href="#"
                        onClick={() => handleSetActivePage('URL')}
                        className={`inline-block p-4 border-b-2 ${activePage === 'URL' ? 'text-blue-600 border-blue-600' : 'border-transparent'} rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    >
                        URL
                    </a>
                </li>
                <li className="me-2">
                    <a
                        href="#"
                        onClick={() => handleSetActivePage('Manual')}
                        className={`inline-block p-4 border-b-2 ${activePage === 'Manual' ? 'text-blue-600 border-blue-600' : 'border-transparent'} rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    >
                        Manual
                    </a>
                </li>
            </ul>
        </div>
        {/* Conditional content rendering based on activePage state */}
        <div>
            {activePage === 'Uploads' && <div>Uploads Content</div>}
            {activePage === 'Text' && <div>Text Content</div>}
            {activePage === 'URL' && (
              <div>
                <div x-show="inputOption === 'url'" className="mb-4">
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
                      <select
                        id="question_type"
                        name="question_type"
                        className="mt-1 block w-full py-2 pl-3 pr-10 text-base text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True or False</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="fill_in_the_blank">Fill in the Blank</option>
                        <option value="matching">Matching</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    {/* Duplicate of the first select for demonstration, ensure to change IDs/names as necessary */}
                    <label className="block font-bold text-gray-800">
                      Question type
                    </label>
                    <div className="mt-1 rounded-md shadow-sm">
                      <select
                        id="question_type2"
                        name="question_type2" 
                        className="mt-1 block w-full py-2 pl-3 pr-10 text-base text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="true_false">True or False</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="fill_in_the_blank">Fill in the Blank</option>
                        <option value="matching">Matching</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activePage === 'Manual' && <div>Manual Content</div>}
        </div>
      </div>
      <QuestionCard />
    </div>
  );
};

export default QuizParameters;