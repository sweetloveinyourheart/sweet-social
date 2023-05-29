import { Avatar, Button, Modal, Spin, Upload, UploadFile, message } from "antd";
import { FunctionComponent, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { UserOutlined } from '@ant-design/icons';
import "../styles/EditAvatar.scss"
import { updateAvatar } from "../services/avatar";

interface EditAvatarProps {
    openMode: "string" | "image"
}

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

const EditAvatar: FunctionComponent<EditAvatarProps> = ({ openMode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const { user, refreshUserData } = useUser()

    const handleCancel = () => {
        setIsMenuOpen(false);
    };

    const showMenu = () => {
        setIsMenuOpen(true);
    };

    const handleRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }

    const handleChange = async (file: UploadFile) => {
        try {
            setLoading(true)
            setFileList([file]);

            const formData = new FormData()
            formData.append('avatar', file as any)
            await updateAvatar(formData)
            await refreshUserData()

            return false
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
            return false
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {openMode === "string"
                ? <Button type="link" onClick={showMenu}>Change profile photo</Button>
                : (
                    <div className="edit-avatar">
                        {(user && user.profile.avatar)
                            ? (
                                <Spin spinning={loading}>
                                    <Avatar
                                        size={125}
                                        style={{ cursor: 'pointer' }}
                                        src={user.profile.avatar}
                                        onClick={showMenu}
                                    />
                                </Spin>
                            )
                            : (
                                <Spin spinning={loading}>
                                    <Avatar
                                        size={125}
                                        style={{ backgroundColor: '#fde3cf', color: '#f56a00', cursor: 'pointer' }}
                                        icon={<UserOutlined />}
                                        onClick={showMenu}
                                    >
                                        {user?.profile.name[0]}
                                    </Avatar>
                                </Spin>
                            )
                        }
                    </div>
                )
            }
            <Modal title={null} open={isMenuOpen} onCancel={handleCancel} footer={null} closable={false} className="user-settings">
                <Upload
                    fileList={fileList}
                    onRemove={handleRemove}
                    beforeUpload={handleChange}
                    className="avatar-uploaded"
                    accept={allowedFileTypes.join(",")}
                >
                    <Button type="link" size="large" onClick={handleCancel}>Upload avatar</Button>
                </Upload>
                <Button type="link" size="large" onClick={handleCancel}>Cancel</Button>
            </Modal>
        </>
    );
}

export default EditAvatar;