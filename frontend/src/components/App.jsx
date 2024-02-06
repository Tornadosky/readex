import React from 'react';
import { notification } from 'antd';
import './App.css';

const key = 'updatable';

export default function App() {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = () => {
    api.open({
      key,
      message: 'Notification Title',
      description: 'description.',
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {contextHolder}
        <button className='text-emerald-300 bg-slate-600 w-20 rounded' onClick={openNotification}>Hi</button>
      </header>
    </div>
  );
}
