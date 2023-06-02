import { Avatar, Button, Dropdown, Typography } from "antd";
import { FunctionComponent } from "react";
import { PostDetail } from "../../services/get-post";
import "../../styles/PostHeader.scss"
import { UserOutlined } from '@ant-design/icons';
import QuickView from "./QuickView";

interface PostHeaderProps {
    post: PostDetail
}

const PostHeader: FunctionComponent<PostHeaderProps> = ({ post }) => {


    return (
        <div className="post-header">
  
                    <Dropdown 
                        dropdownRender={() => <QuickView username={post.user.profile.username}/>}
                    >
                        <div className="author">
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
                            <div className="author__right">
                                <div className="settings">
                                    <Button type="link">•••</Button>
                                </div>
                            </div>
                        </div>
                    </Dropdown>
        </div>
    );
}

export default PostHeader;