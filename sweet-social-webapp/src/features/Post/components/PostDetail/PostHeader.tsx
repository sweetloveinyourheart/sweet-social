import { Avatar, Button, Typography } from "antd";
import { FunctionComponent } from "react";
import { PostDetail } from "../../services/get-post";
import "../../styles/PostHeader.scss"
import { UserOutlined } from '@ant-design/icons';

interface PostHeaderProps {
    post: PostDetail
}

const PostHeader: FunctionComponent<PostHeaderProps> = ({ post }) => {
    return (
        <div className="post-header">
            <div className="author">
                <div className="author__left">
                    <div className="author-avatar">
                        <Avatar src={post.user.profile.avatar} icon={<UserOutlined />}/>
                    </div>

                    <div className="author-desc">
                        <Typography.Title level={5}>
                            {post.user.profile.username}
                        </Typography.Title>
                        <div className="dot">
                            •
                        </div>
                        <Button type="link">Follow</Button>
                    </div>
                </div>
                <div className="author__right">
                    <div className="settings">
                        <Button type="link">•••</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostHeader;