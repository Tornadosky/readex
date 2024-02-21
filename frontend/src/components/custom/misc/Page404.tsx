import React from 'react';
import { useLocation } from 'react-router-dom';

import { NotFoundIcon } from '@/assets/svg';

const Page404: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div style={{ height: '295px', width: '250px', margin: 'auto' }}>
                    <NotFoundIcon />
                </div>
                <div className="text-black text-2xl leading-9 mt-8">404</div>
                <div className="text-black text-base leading-7 mt-2">Sorry, the page "{location.pathname}" you visited does not exist.</div>
                <div className="mt-8">
                    <a href="/home" className="text-blue-600 hover:text-blue-800">Back Home</a>
                </div>
            </div>
        </div>
    );
};

export default Page404;
