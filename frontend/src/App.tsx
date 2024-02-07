import { Button } from "@/components/ui/button"
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import './App.css'

export default function App() {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        {contextHolder}
        <h1 className='text-3xl font-bold text-emerald-600'>Hi</h1>
        <Button className='mt-4' variant="destructive" onClick={openNotification}>Click me</Button>
      </div>
    </>
  )
}
