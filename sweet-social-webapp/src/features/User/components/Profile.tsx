import { Button, Col, Menu, MenuProps, Row, Typography } from "antd";
import { FunctionComponent, useState } from "react";
import { AppstoreOutlined, BookOutlined } from '@ant-design/icons';
import "../styles/User.scss"
import { useUser } from "../contexts/UserContext";
import UserSettings from "./UserSettings";
import { useNavigate } from "react-router-dom";
import EditAvatar from "./EditAvatar";
import PersonalPosts from "../../Post/components/PersonalPosts/PersonalPosts";
import SavedPosts from "../../Post/components/PersonalPosts/SavedPosts";

interface ProfileProps { }

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
    }
]

const Profile: FunctionComponent<ProfileProps> = () => {
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

    const renderMenuTabs = () => {
        switch (current) {
            case ProfileMenu.Post:
                return <PersonalPosts />

            case ProfileMenu.Saved: 
                return <SavedPosts />
        
            default:
                return <PersonalPosts />;
        }
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
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>
            {renderMenuTabs()}
        </div>
    );
}

export default Profile;