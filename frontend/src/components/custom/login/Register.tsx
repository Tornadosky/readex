import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Form, Input, Card } from 'antd';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Card
                title="Register"
                bordered={false}
                style={{ width: 400 }}
                headStyle={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}
            >
                <Form
                    name="normal_register"
                    className=""
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your E-mail!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <button className='p-2 w-full rounded text-blue-600 bg-blue-200 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-600'>
                            Register
                        </button>
                    </Form.Item>
                    <Form.Item>
                        Already have an account? <div className='text-blue-500' onClick={() => navigate('/login')}>Log in now!</div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
