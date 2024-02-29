import { useState } from 'react';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { EditIcon } from '@/assets/svg';

interface TopbarProps {
    name: string;
    inputPage: string;
    pageCount: number;
    handleIncrease: () => void;
    handleDecrease: () => void;
    handlePageInput: (e: any) => void;
    submitPageInput: (e: any) => void;
    handleBookNameChange: (newBookName: string) => void;
}

const Topbar = ({
    name, 
    inputPage, 
    pageCount, 
    handleDecrease, 
    handleIncrease, 
    handlePageInput, 
    submitPageInput,
    handleBookNameChange
} : TopbarProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newBookName, setNewBookName] = useState(name);

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
                            className="bg-transparent border rounded p-1 focus:outline-none"
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