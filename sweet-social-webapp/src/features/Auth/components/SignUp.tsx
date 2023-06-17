import { Alert, Button, Divider, Form, Input, Typography } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import "../styles/Auth.scss"
import Logo from "../../../components/Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PageLoading from "../../../components/Loading/PageLoading";
import OAuth from "./OAuth";

interface SignUpProps { }

const SignUp: FunctionComponent<SignUpProps> = () => {
    const [form] = Form.useForm();
    const [componentLoading, setComponentLoading] = useState<boolean>(true)

    const navigate = useNavigate()
    const { register, error, loading, accessToken } = useAuth()

    useEffect(() => {
        if (accessToken) {
            navigate('/')
        }

        setComponentLoading(false)
    }, [accessToken])

    const onFinish = async (values: any) => {
        const body = values
        await register(body)
        navigate('/auth/new-account')
    };

    if (loading || componentLoading) return <PageLoading />

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
                    <Typography.Paragraph style={{ textAlign: 'center', fontSize: 16, margin: 0 }}>
                        Sign up to see photos and videos from your friends.
                    </Typography.Paragraph>
                </Form.Item>
                <Form.Item>
                    <OAuth loading={loading} />
                </Form.Item>
                <Divider style={{ color: "#777", fontSize: 13 }}>OR</Divider>
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
                <Form.Item
                    name={["profile", "username"]}
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        { min: 3, message: 'Username must have at least 3 characters!' },
                        { max: 50, message: 'Username too long!' },
                    ]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name={["profile", "name"]}
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 3, message: 'Fullname must have at least 3 characters!' },
                        { max: 100, message: 'Fullname too long!' },
                    ]}
                >
                    <Input placeholder="Fullname" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                        Create new account
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
            </Form>
            <div className="auth-switcher">
                <Typography.Text>
                    Have an account?
                    &nbsp;
                    <Link to={"/auth/sign-in"}>Log in</Link>
                </Typography.Text>
            </div>
        </>
    );
}

export default SignUp;