import { Button, Modal } from "antd";
import { FunctionComponent, useState } from "react";
import { SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../../Auth/contexts/AuthContext'
import { useNavigate } from "react-router-dom";
import "../styles/UserSettings.scss"

interface UserSettingsProps {

}

const UserSettings: FunctionComponent<UserSettingsProps> = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { logout } = useAuth()
    const navigate = useNavigate()

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        await logout()
        navigate('/auth/sign-in')
    }

    return (
        <>
            <Button type="link" icon={<SettingOutlined />} onClick={showModal} />
            <Modal title={null} open={isModalOpen} onCancel={handleCancel} footer={null} closable={false} className="user-settings">
                    <Button type="link" size="large">Edit profile</Button>
                    <Button type="link" size="large" onClick={handleLogout}>Logout</Button>
                    <Button type="link" size="large" onClick={handleCancel}>Cancel</Button>
            </Modal>
        </>
    );
}

export default UserSettings;