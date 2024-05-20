import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input, Card } from 'antd';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Card
                title="Login"
                bordered={false}
                style={{ width: 400 }}
                headStyle={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}
            >
                <Form
                    name="normal_login"
                    className=""
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="" href="">
                            Forgot password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        {/* <Button type="primary" htmlType="submit" className="">
                            Log in
                        </Button> */}

                        <button className='p-2 w-full rounded text-blue-600 bg-blue-200 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-600'>
                            Login
                        </button>
                        Or <div className='text-blue-500' onClick={() => navigate('/register')}>register now!</div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};