import { Alert, Button, Divider, Form, Input, Typography } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import Logo from "../../../components/Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { GoogleCircleFilled } from '@ant-design/icons';
import { useAuth } from "../contexts/AuthContext";
import PageLoading from "../../../components/Loading/PageLoading";

interface SignInProps {

}

const SignIn: FunctionComponent<SignInProps> = () => {
    const [form] = Form.useForm();
    const [componentLoading, setComponentLoading] = useState<boolean>(true)

    const navigate = useNavigate()
    const { login, error, loading, accessToken } = useAuth()

    useEffect(() => {
        if(accessToken) {
            navigate('/')
        } 

        setComponentLoading(false)
    }, [accessToken])


    const onFinish = async (values: any) => {
        await login(values)
        navigate('/')
    };

    if(loading || componentLoading) return <PageLoading />

    return (
        <>
            <Form
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                layout="vertical"
                className="auth-form"
            >
                <Form.Item>
                    <Logo style={{ textAlign: 'center', marginBottom: 16 }} />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' }
                    ]}>
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 3, message: 'Password must have at least 3 characters!' },
                        { max: 50, message: 'Password too long!' },
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        style={{ width: '100%' }} 
                        disabled={loading}
                    >
                        Login
                    </Button>
                </Form.Item>
                {error
                    ? (
                        <Form.Item>
                            <Alert message={error} type="error" showIcon />
                        </Form.Item>
                    )
                    : null
                }
                <Divider style={{ color: "#777", fontSize: 13 }}>OR</Divider>
                <Form.Item>
                    <Button 
                        type="link" 
                        htmlType="button" 
                        className="oauth-btn-link" 
                        icon={<GoogleCircleFilled />}
                        disabled={loading}
                    >
                        Login with Google
                    </Button>
                </Form.Item>
            </Form>

            <div className="auth-switcher">
                <Typography.Text>
                    Don't have an account?
                    &nbsp;
                    <Link to={"/auth/sign-up"}>Sign up</Link>
                </Typography.Text>
            </div>
        </>
    );
}

export default SignIn;