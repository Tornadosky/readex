import { Fragment, useState } from 'react'; 
import HighlightsList from './HighlightsList'; 
import BooksList from './BooksList';
import TestsList from './TestsList';
import type { IHighlight } from "./react-pdf-highlighter";
import { CloseOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import SmallSidebar from './SmallSidebar';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const sections = [
  { id: 1, name: 'Artificial Intelligence' },
  { id: 2, name: 'Design' },
  { id: 3, name: 'My favourite books' },
  { id: 4, name: 'Web pages' },
]

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
}: Props) {
  const [view, setView] = useState('Books');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(sections[0])

  const handleViewChange = (newView: string) => () => {
    if (view === newView && isSidebarOpen) {
      // If the new view is the same as the current view and the sidebar is open, toggle it
      setIsSidebarOpen(false);
    } else {
      // Otherwise, change the view and ensure the sidebar is open
      setView(newView);
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const testBooks = [
    {
      id: '1',
      title: 'GRE Official Guide',
      url: '/pdfs/42a4bed4-e125-4bf3-a4c0-1e66fb875b77/view',
    },
    {
      id: '2',
      title: 'TOEFL Preparation Book',
      url: '/pdfs/54f1c2bd-ec4e-4f2e-a10e-2f639e8d8f47/view',
    },
    {
      id: '3',
      title: 'GMAT Exam Guide',
      url: '/pdfs/e1b5b2de-3bfa-4a5b-8a9a-7e4f422c4c4e/view',
    },
  ];

  const testTests = [
    {
      id: '1',
      title: 'GRE Official Guide',
      url: '/tests/42a4bed4-e125-4bf3-a4c0-1e66fb875b77/edit',
    },
    {
      id: '2',
      title: 'TOEFL Preparation Book',
      url: '/tests/54f1c2bd-ec4e-4f2e-a10e-2f639e8d8f47/edit',
    },
    {
      id: '3',
      title: 'GMAT Exam Guide',
      url: '/tests/e1b5b2de-3bfa-4a5b-8a9a-7e4f422c4c4e/edit',
    },
  ];

  return (
    <>
      <SmallSidebar
        handleViewChange={handleViewChange}
        view={view}
      />

      {isSidebarOpen && (
        <div className="sidebar border-r" style={{ width: "20vw" }}>
          <div className="submenu-header focus-visible:none border-b" style={{ backgroundColor: '#f3f3f6'}}>
            <span className="ellipsis flex items-center gap-1 mx-3">
              {view}
            </span>
            <div className="flex items-center">
              <PlusOutlined onClick={() => setIsModalOpen(true)} className="cursor-pointer text-gray-400 hover:text-gray-500 rounded" style={{ fontSize: '18px' }} />
              <div className="border-l mx-2 h-5" style={{ borderColor: '#d1d5db' }}></div>
              <CloseOutlined onClick={toggleSidebar} className="cursor-pointer mr-4 text-gray-400 hover:text-gray-500 rounded" />
            </div>
          </div>
          
          <div style={{ maxHeight: 'calc(100vh - 57px)', overflowY: 'auto' }}>
            {view === 'Notes' ? (
              <HighlightsList 
                highlights={highlights}
                resetHighlights={resetHighlights}
                toggleDocument={toggleDocument}
              />
            ) : view === "Books" ? (
              <BooksList 
                books={testBooks}
              />
            ) : view === "Tests" ? (
              <TestsList 
                tests={testTests}
              />
            ) : (
              <BooksList 
                books={testBooks}
              />
            )}
          </div>
        </div>
      )}
      
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {setIsModalOpen(false)}}>
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
                  <div>
                    <label className="block font-bold mb-2 text-gray-800">
                      Section
                    </label>
                    <Listbox value={selectedSection} onChange={setSelectedSection}>
                      <div className="relative mt-1 border border-slate-300 rounded">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <span className="block truncate">{selectedSection.name}</span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 border border-slate-300 ring-black/5 focus:outline-none sm:text-sm">
                            {sections.map((section) => (
                              <Listbox.Option
                                key={section.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                  }`
                                }
                                value={section}
                              >
                                <span
                                  className={`block truncate ${
                                    selectedSection.name === section.name ? 'font-medium' : 'font-normal'
                                  }`}
                                >
                                  {section.name}
                                </span>
                                {selectedSection.name === section.name ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div className="border-b mt-5 mb-3 w-full" style={{ borderColor: '#d1d5db' }}></div>

                  <div>
                    <label className="block font-bold text-gray-800">
                      URL
                    </label>
                    <div className="flex mt-1 rounded-md shadow-sm">
                      <input
                        type="text"
                        name="url"
                        id="url"
                        x-model="formData.url"
                        placeholder="E.g. https://cs231n.github.io/neural-networks-3/"
                        className="flex-1 block w-full min-w-0 border border-gray-300 rounded-md text-gray-800 focus:border-indigo-500 focus:ring-indigo-500 mt-1 p-2"
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      The URL must be publicly accessible and not behind a login.
                    </div>
                  </div>

                  <div className='my-4 flex justify-center items-center text-slate-400'>
                    - OR -
                  </div>

                  <div className="">
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag file to this area to upload</p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                        banned files.
                      </p>
                    </Dragger>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {setIsModalOpen(false)}}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}