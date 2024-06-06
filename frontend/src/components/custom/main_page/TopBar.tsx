import { FC } from "react";
  
interface TopBarProps {
    handleCreateSection: () => void;
}

export const TopBar: FC<TopBarProps> = ({ handleCreateSection }) => {
    return (
        <div
            className='fixed z-10 bg-gray-100 p-2 border-y border-gray-200 dark:border-slate-800 dark:bg-slate-800 dark:text-gray-200'
            style={{ width: '100%' }}
        >
            <div className="mb-[2px] flex">
                <h1 className='ml-5 text-lg flex items-center'>
                    Library
                </h1>

                <button className="create-section-button flex ml-[1150px]" onClick={handleCreateSection}>
                    Create new section
                </button>
            </div>
        </div>
    );
};