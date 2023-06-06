import { Button, Modal, Popconfirm, message } from "antd";
import { FunctionComponent, useState } from "react";
import "../../styles/PostSetting.scss"
import { PostDetail } from "../../services/get-post";
import { useUser } from "../../../User/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { removePost } from "../../services/remove.post";
import { usePostViewer } from "../../contexts/PostViewer";
import { changePostVisibility } from "../../services/change-post-settings";

interface PostSettingProps {
    post: PostDetail
}

const PostSetting: FunctionComponent<PostSettingProps> = ({ post }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate()
    const { user } = useUser()
    const { closePost } = usePostViewer()

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleGoProfile = () => {
        navigate(`/u/${post.user.profile.username}`)
        setIsModalOpen(false);
        closePost()
    };

    const handleRemovePost = async () => {
        try {
            await removePost(post.id)

            setIsModalOpen(false);
            closePost()
            message.success('Post has been removed !')
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        }
    }

    const handleChangeVisibility = async () => {
        try {
            const currentVisibility = post.settings.isPublic
            await changePostVisibility(post.id, !currentVisibility)

            setIsModalOpen(false);
            closePost()
            message.success('Post settings was changed !')
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        }
    }
    

    return (
        <div className="post-settings">
            <Button className="open-btn" type="link" onClick={showModal}>•••</Button>
            <Modal
                title={null}
                className="post-settings-modal"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                closable={false}
            >
                <Button className="setting-btn" type="link" size="large" onClick={handleGoProfile}>Go to profile</Button>
                {user?.profile.username === post.user.profile.username
                    ? (
                        <Popconfirm
                            title="Warning"
                            description="Are you sure to delete this post?"
                            onConfirm={handleRemovePost}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button className="setting-btn" danger type="text" size="large">Remove post</Button>
                        </Popconfirm>
                    )
                    : null
                }
                {user?.profile.username === post.user.profile.username
                    ? (
                        <Button className="setting-btn" type="text" size="large" onClick={handleChangeVisibility}>
                            {post.settings.isPublic ? "Make private" : "Make public"}
                        </Button>
                    )
                    : null
                }
                <Button className="setting-btn" type="link" size="large" onClick={handleCancel}>Cancel</Button>
            </Modal>
        </div>
    );
}

export default PostSetting;