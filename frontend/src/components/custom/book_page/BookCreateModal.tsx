import React, { Fragment, useState } from 'react'; 
import { LoadingIcon } from '@/assets/svg';
import { CloseOutlined, InboxOutlined } from '@ant-design/icons';
import { Dialog, Transition } from '@headlessui/react';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import Selector from './Selector';
import { RcFile } from 'antd/es/upload';
import axios from 'axios';
  
const { Dragger } = Upload;
  
interface Props {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    selectedSection: any;
    setSelectedSection: (value: any) => void;
    sections: Array<any>;
    disabled: boolean;
    onSubmit: (file: File, newId: string) => void;
}

const BookCreateModal: React.FC<Props> = ({ isModalOpen, setIsModalOpen, selectedSection, setSelectedSection, sections, disabled , onSubmit }) => {
    const [uploadedFile, setUploadedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error(`${file.name} is not a pdf file`);
                return Upload.LIST_IGNORE;
            }
            // Instead of uploading, just save the file object
            setUploadedFile(file);
            // Prevent the file from being added to the list, as we're handling it manually
            return false; 
        },
        onChange(info) {
          const { status } = info.file;
          console.log(info.file);
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'removed') {
            setUploadedFile(null);
          }
          if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            setUploadedFile(info.file);
          } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            setUploadedFile(null);
          }
        },
        onDrop(e) {
          console.log('Dropped files', e.dataTransfer.files);
          setUploadedFile(e.dataTransfer.files[0]);
        },
    };

    const handleSubmit = async () => {
        if (!uploadedFile) return; 

        setUploading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);
        try {
            const documentBase64 = await fileToBase64(uploadedFile);

            const response = await axios.post('http://localhost:3000/graphql', {
                query: `
                    mutation AddBook($title: String!, $author: String, $document: String!, $image: String, $highlights: [Int], $collections: [Int], $user: Int!) {
                        setBook(
                            title: $title,
                            author: $author,
                            document: $document,
                            image: $image,
                            highlights: $highlights,
                            collections: $collections,
                            user: $user
                        ) {
                            id
                            title
                            author
                            document
                            image
                            user {
                                id
                                login
                            }
                        }
                    }
                `,
                variables: {
                    title: uploadedFile.name,
                    author: "Autroh",
                    document: documentBase64.replace('data:application/pdf;base64,', ''),
                    image: null,
                    highlights: [],
                    collections: [1],
                    user: 1,
                }
            });

            console.log(response.data);

            if (response.data.data && !response.data.errors) {
                message.success('File uploaded and section updated successfully');
                onSubmit(uploadedFile, response.data.data.setBook.id);
            } else {
                message.error('File upload failed.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            message.error('File upload failed.');
        }
        setUploading(false);
        setUploadedFile(null);
        setIsModalOpen(false);
    };

    const handleClosed = () => {
        setUploadedFile(null);
        setIsModalOpen(false);
    }

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
                                Section
                            </label>
                            <Selector 
                                options={sections.map((section) => section.title)}
                                selected={selectedSection.title}
                                disabled={disabled}
                                setSelected={(value) => setSelectedSection(sections.find((section) => section.title === value) || sections[0])}
                            />
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
                            {uploadedFile && <div className="mt-2 text-sm font-medium text-green-600">Uploaded: {uploadedFile.name}</div>}
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                onClick={handleSubmit}
                                disabled={uploading || !uploadedFile}
                            >
                                {uploading ? (
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
}

export default BookCreateModal;