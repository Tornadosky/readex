import { Fragment, useState } from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { EditIcon, PageScaleIcon, DefaultScaleIcon, PageFitIcon, WidthFitIcon } from '@/assets/svg';

import { Menu, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid'


const scales = [
    { id: 1, name: 'Default', icon: <DefaultScaleIcon /> },
    { id: 2, name: 'Width Fit', icon: <WidthFitIcon /> },
    { id: 3, name: 'Page Fit', icon: <PageFitIcon /> },
  ]

interface TopbarProps {
    name: string;
    inputPage: string;
    pageCount: number;
    handleIncrease: () => void;
    handleDecrease: () => void;
    handlePageInput: (e: any) => void;
    submitPageInput: (e: any) => void;
    handleBookNameChange: (newBookName: string) => void;
    handleScaleChange: (scale: string) => void;
}

const Topbar = ({
    name, 
    inputPage, 
    pageCount, 
    handleDecrease, 
    handleIncrease, 
    handlePageInput, 
    submitPageInput,
    handleBookNameChange,
    handleScaleChange
} : TopbarProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBookName, setNewBookName] = useState(name);
    const [selectedScale, setSelectedScale] = useState(scales[0]);

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleChangeBookName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewBookName(e.target.value);
    };

    const handleSubmitBookNameChange = () => {
        handleBookNameChange(newBookName);
        setIsEditing(false);
    };

    return (
        <div
            className='flex justify-between items-center bg-gray-100 p-2 border-gray-200'
            style={{ width: "100%", height: "57px", border: "1px solid #e8e8e8"}}
        >
            <h1 className='m-2 flex items-center'>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={newBookName}
                            onChange={handleChangeBookName}
                            onBlur={handleSubmitBookNameChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitBookNameChange()}
                            className="bg-transparent border-b border-blue-400 p-1 focus:outline-none"
                            autoFocus
                        />
                    </>
                ) : (
                    <>
                        {newBookName}
                        <button 
                            className='text-gray-600 mx-2'
                            onClick={toggleEditMode}
                        >
                            <EditIcon />
                        </button>
                    </>
                )}
            </h1>
            
            <Menu as="div" className="relative inline-block text-left mt-auto">
                <Menu.Button>
                    <PageScaleIcon />
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute mt-2 w-40 z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {scales.map((scale) => (
                                <Menu.Item key={scale.id}>
                                    {({ active }) => (
                                    <button
                                        className={`${active ? 'bg-gray-200' : ''} text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => { 
                                            setSelectedScale(scale);
                                            handleScaleChange(scale.name)
                                        }}
                                    >
                                        <div className="mr-2 h-5 w-5" aria-hidden="true">
                                            {scale.icon}
                                        </div>
                                        
                                        {scale.name}

                                        {selectedScale.name === scale.name && (
                                            <CheckIcon className="ml-auto h-5 w-5"/>
                                        )}
                                    </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                }}
            >
                <button 
                    type="button" 
                    className="w-8 h-8 text-white bg-zinc-400 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
                    onClick={handleDecrease}
                >
                    <UpOutlined />
                </button> 
                <div style={{ margin: '0px 8px', display: 'flex', flexShrink: '0', alignItems: "center" }}>
                    <span>
                        <input
                            type="text"
                            data-testid="page-navigation__current-page-input"
                            aria-label="Enter a page number"
                            className="input-pages text-black bg-white border-none font-normal text-[22px] leading-normal"
                            placeholder=""
                            value={inputPage}
                            onChange={handlePageInput}
                            onKeyDown={submitPageInput}
                        />
                    </span>
                    <span style={{ margin: "0px 3px" }}>/</span>
                    {pageCount}
                </div>
                <button 
                    type="button" 
                    className="w-8 h-8 text-white bg-zinc-400 hover:bg-zinc-600 focus:outline-none font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center"
                    onClick={handleIncrease}
                >
                    <DownOutlined />
                </button>               
            </div>
        </div>
    );
}

export default Topbar;