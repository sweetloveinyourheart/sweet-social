import { Avatar, Dropdown, Typography } from "antd";
import { FunctionComponent } from "react";
import { PostDetail } from "../../services/get-post";
import "../../styles/PostHeader.scss"
import { UserOutlined } from '@ant-design/icons';
import QuickView from "./QuickView";
import PostSetting from "./PostSetting";

interface PostHeaderProps {
    post: PostDetail
}

const PostHeader: FunctionComponent<PostHeaderProps> = ({ post }) => {

    return (
        <div className="post-header">

            <div className="author">
                <Dropdown
                    dropdownRender={() => <QuickView username={post.user.profile.username} />}
                >
                    <div className="author__left">
                        <div className="author-avatar">
                            <Avatar src={post.user.profile.avatar} icon={<UserOutlined />} />
                        </div>

                        <div className="author-desc">
                            <Typography.Title level={5}>
                                {post.user.profile.username}
                            </Typography.Title>
                            <div className="dot">
                                •
                            </div>
                            <div className="author-name">
                                {post.user.profile.name}
                            </div>
                        </div>
                    </div>
                </Dropdown>

                <div className="author__right">
                    <PostSetting post={post} />
                </div>
            </div>
        </div>
    );
}

export default PostHeader;