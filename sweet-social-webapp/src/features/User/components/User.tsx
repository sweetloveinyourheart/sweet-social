import { Avatar, Button, Col, Menu, MenuProps, Row, Typography } from "antd";
import { FunctionComponent, useState } from "react";
import { UserOutlined, AppstoreOutlined, BookOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import "../styles/User.scss"
import { useUser } from "../contexts/UserContext";
import UserSettings from "./UserSettings";
import { useNavigate } from "react-router-dom";
import EditAvatar from "./EditAvatar";

interface UserProps { }

enum ProfileMenu {
    Post = 'post',
    Saved = 'saved',
    Tagged = 'tagged'
}

const items: MenuProps['items'] = [
    {
        label: 'Post',
        key: ProfileMenu.Post,
        icon: <AppstoreOutlined />,
    },
    {
        label: 'Saved',
        key: ProfileMenu.Saved,
        icon: <BookOutlined />
    },
    {
        label: 'Tagged',
        key: ProfileMenu.Tagged,
        icon: <UsergroupAddOutlined />
    },
]

const User: FunctionComponent<UserProps> = () => {
    const [current, setCurrent] = useState<ProfileMenu>(ProfileMenu.Post);

    const { user } = useUser()
    const navigate = useNavigate()

    const onClick: MenuProps['onClick'] = (e) => {
        const menu = e.key as ProfileMenu
        setCurrent(menu);
    };

    const handleEditProfile = () => {
        navigate('/accounts/edit')
    }

    return (
        <div className="profile">
            <Row>
                <Col span={6}>
                    <EditAvatar openMode="image"/>
                </Col>
                <Col span={18}>
                    <div className="profile-title">
                        <Typography.Title level={3}>
                            {user?.profile.username}
                        </Typography.Title>
                        <Button onClick={handleEditProfile}>Edit profile</Button>
                        <UserSettings />
                    </div>
                    <div className="profile-count">
                        <div className="counter">
                            <Typography.Text>4 posts</Typography.Text>
                        </div>
                        <div className="counter">
                            <Button type="link">82 Follower</Button>
                        </div>
                        <div className="counter">
                            <Button type="link">22 Following</Button>
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
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>
        </div>
    );
}

export default User;