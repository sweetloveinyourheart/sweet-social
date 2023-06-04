import { Avatar, Button, Col, Menu, MenuProps, Row, Typography, message } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { AppstoreOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import "../styles/User.scss"
import { useNavigate, useParams } from "react-router-dom";
import PersonalPosts from "../../Post/components/PersonalPosts/PersonalPosts";
import { UserProfile, getUserProfile } from "../services/user";
import PageLoading from "../../../components/Loading/PageLoading";
import { connectToSingleChatbox } from "../../Messages/services/connect-chatbox";

interface UserProps { }

enum ProfileMenu {
    Post = 'post',
}

const items: MenuProps['items'] = [
    {
        label: 'Post',
        key: ProfileMenu.Post,
        icon: <AppstoreOutlined />
    }
]

const User: FunctionComponent<UserProps> = () => {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const { username } = useParams()

    useEffect(() => {
        if (!username) {
            navigate('/')
            return;
        }
        (async () => {
            try {
                const data = await getUserProfile(username)
                setUser(data)
            } catch (error) {
                navigate('/')
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const onMakeConversation = async () => {
        try {
            if (!user) return;

            setLoading(true)

            const { chatboxId } = await connectToSingleChatbox(user.id)
            navigate(`/messages/${chatboxId}`)

        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <PageLoading />

    return (
        <div className="profile">
            <Row>
                <Col span={6}>
                    <Avatar size={125} src={user?.profile.avatar} icon={<UserOutlined />} />
                </Col>
                <Col span={18}>
                    <div className="profile-title">
                        <Typography.Title level={3}>
                            {user?.profile.username}
                        </Typography.Title>
                        <Button 
                            type="primary" 
                            style={{ color: "#fff" }} 
                            onClick={onMakeConversation}
                            icon={<MessageOutlined />}
                        >
                            Chat
                        </Button>
                    </div>
                    <div className="profile-count">
                        <div className="counter">
                            <Typography.Text>{user?.userStats.post} posts</Typography.Text>
                        </div>
                        <div className="counter">
                            <Button type="link">{user?.userStats.followers} Follower</Button>
                        </div>
                        <div className="counter">
                            <Button type="link">{user?.userStats.following} Following</Button>
                        </div>
                    </div>
                    <div className="profile-name">
                        <Typography.Title level={5}>
                            {user?.profile.name}
                        </Typography.Title>
                    </div>
                </Col>
            </Row>
            <div className="profile-menu">
                <Menu selectedKeys={[ProfileMenu.Post]} mode="horizontal" items={items} />
            </div>
            <PersonalPosts username={username} />
        </div>
    );
}

export default User;