import { FunctionComponent, useEffect, useState } from "react";
import "../styles/EditProfile.scss"
import { Alert, Avatar, Button, Col, Form, Input, Row, Select, Spin, Typography, notification } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useUser } from "../contexts/UserContext";
import { updateProfile } from "../services/user";
import EditAvatar from "./EditAvatar";

interface EditProfileProps {

}

const EditProfile: FunctionComponent<EditProfileProps> = () => {
    const [form] = Form.useForm();
    const [submittable, setSubmittable] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const { user, refreshUserData } = useUser()

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                username: user.profile.username,
                bio: user.profile.bio,
                gender: user.profile.gender,
                name: user.profile.name
            })
        }
    }, [user])

    const onFinish = async (values: any) => {
        try {
            await updateProfile(values)
            notification.open({
                message: 'Update profile successfully',
                type: "success",
                description: 'Your profile has been updated, feel free to try another feature ^.^',
            });
            await refreshUserData()
        } catch (error: any) {
            setError(error.response?.data?.message || `An error occurred: ${error.message}`)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="edit-profile">
            <Typography.Title level={3}>
                Edit profile
            </Typography.Title>
            <Form
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onValuesChange={() => setSubmittable(true)}
                onFinish={onFinish}
            >
                <Form.Item>
                    <Row>
                        <Col span={8}>
                            <div className="edit-avatar">
                                {(user && user.profile.avatar)
                                    ? (
                                        <Spin spinning={loading}>
                                            <Avatar
                                                size={40}
                                                style={{ cursor: 'pointer' }}
                                                src={user.profile.avatar}
                                            />
                                        </Spin>
                                    )
                                    : (
                                        <Spin spinning={loading}>
                                            <Avatar
                                                size={40}
                                                style={{ backgroundColor: '#fde3cf', color: '#f56a00', cursor: 'pointer' }}
                                                icon={<UserOutlined />}
                                            >
                                                {user?.profile.name[0]}
                                            </Avatar>
                                        </Spin>
                                    )
                                }
                            </div>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={15}>
                            <div className="edit-avatar-picker">
                                <Typography.Title level={5}>{user?.profile.username}</Typography.Title>
                                <EditAvatar openMode="string" />
                            </div>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Fullname"
                    name="name"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Bio"
                    name="bio"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item label="Select">
                    <Select placeholder="Select your gender">
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>

                {error
                    ? (
                        <Form.Item label="Error">
                            <Alert message={error} type="error" showIcon />
                        </Form.Item>
                    )
                    : null
                }

                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit" disabled={!submittable || loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default EditProfile;