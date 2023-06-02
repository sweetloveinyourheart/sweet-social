import { FunctionComponent, useEffect, useState } from "react";
import moment from "moment";
import { HeartOutlined, HeartFilled, CommentOutlined, BookOutlined, BookFilled } from '@ant-design/icons'
import { Skeleton, Typography, message } from "antd";
import { PostDetail } from "../../services/get-post";
import "../../styles/PostReaction.scss"
import { dislikePost, getPostReaction, likePost } from "../../services/post-reactions";

interface PostReactionProps {
    post: PostDetail
    onCommentClick: () => void
}

const PostReaction: FunctionComponent<PostReactionProps> = ({ post, onCommentClick }) => {
    const [liked, setLiked] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)
    const [likesCount, setLikesCount] = useState<number>(0)

    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            try {
                const reactions = await getPostReaction(post.id)
                setLiked(reactions.liked)
                setSaved(reactions.saved)
                setLikesCount(post.likesCount)
            } finally {
                setLikesCount(post.likesCount)
                setLoading(false)
            }
        })()
    }, [post])

    const handleCmtClick = () => {
        onCommentClick()
    }

    const handleLikeClick = async () => {
        try {
            if (liked) {
                await dislikePost(post.id)
                setLikesCount(s => --s)
            }
            else {
                await likePost(post.id)
                setLikesCount(s => ++s)
            }

            setLiked(s => !s)
        } catch (error) {
            message.error('Something went wrong, please try again !')
        }
    }

    const handleSaveClick = () => {
        setSaved(s => !s)
    }

    return (
        loading
            ? <Skeleton active />
            : (
                <div className="post-reaction">
                    <div className="behavior">
                        <div className="behavior__left">
                            <button onClick={handleLikeClick}>
                                {liked ? <HeartFilled style={{ color: "#f30606" }} /> : <HeartOutlined />}
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
                            {likesCount} likes
                        </Typography.Title>
                        <Typography.Text>
                            {moment(post.createdAt).format('MMMM DD')}
                        </Typography.Text>
                    </div>
                </div>
            )
    );
}

export default PostReaction;