import { FunctionComponent } from "react";
import moment from "moment";
import { HeartOutlined, CommentOutlined, BookOutlined } from '@ant-design/icons'
import { Typography } from "antd";
import { PostDetail } from "../../services/get-post";
import "../../styles/PostReaction.scss"

interface PostReactionProps {
    post: PostDetail
    onCommentClick: () => void
}

const PostReaction: FunctionComponent<PostReactionProps> = ({ post, onCommentClick }) => {

    const handleCmtClick = () => {
        onCommentClick()
    }

    return (
        <div className="post-reaction">
            <div className="behavior">
                <div className="behavior__left">
                    <button>
                        <HeartOutlined />
                    </button>
                    <button onClick={handleCmtClick}>
                        <CommentOutlined />
                    </button>
                </div>
                <div className="behavior__right">
                    <button>
                        <BookOutlined />
                    </button>
                </div>
            </div>
            <div className="info">
                <Typography.Title level={5}>
                    {post.likesCount} likes
                </Typography.Title>
                <Typography.Text>
                    {moment(post.createdAt).format('MMMM DD')}
                </Typography.Text>
            </div>
        </div>
    );
}

export default PostReaction;