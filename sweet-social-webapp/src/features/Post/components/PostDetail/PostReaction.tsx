import { FunctionComponent, useState } from "react";
import moment from "moment";
import { HeartOutlined, HeartFilled , CommentOutlined, BookOutlined, BookFilled } from '@ant-design/icons'
import { Typography } from "antd";
import { PostDetail } from "../../services/get-post";
import "../../styles/PostReaction.scss"

interface PostReactionProps {
    post: PostDetail
    onCommentClick: () => void
}

const PostReaction: FunctionComponent<PostReactionProps> = ({ post, onCommentClick }) => {
    const [liked, setLiked] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)

    const handleCmtClick = () => {
        onCommentClick()
    }

    const handleLikeClick = () => {
        setLiked(s => !s)
    }

    const handleSaveClick = () => {
        setSaved(s => !s)
    }

    return (
        <div className="post-reaction">
            <div className="behavior">
                <div className="behavior__left">
                    <button onClick={handleLikeClick}>
                        {liked ? <HeartFilled style={{ color: "#f30606" }} /> :  <HeartOutlined />}
                    </button>
                    <button onClick={handleCmtClick}>
                        <CommentOutlined />
                    </button>
                </div>
                <div className="behavior__right">
                    <button onClick={handleSaveClick}>
                        {saved ? <BookFilled style={{ color: "#ffb41f" }} /> : <BookOutlined />}
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