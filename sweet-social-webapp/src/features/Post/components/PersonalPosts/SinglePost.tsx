import { FunctionComponent } from "react";
import "../../styles/SinglePost.scss"
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import { Post } from "../../services/personal-post";
import { usePostViewer } from "../../contexts/PostViewer";

interface SinglePostProps {
    post: Post
}

const SinglePost: FunctionComponent<SinglePostProps> = ({ post }) => {
    const { openPost } = usePostViewer()

    return (
        <div className="single-post" onClick={() => openPost(post.id)}>
            <img src={post.medias[0].mediaUrl} alt="image" />
            <div className="like-cmt-counts">
                <div className="likes-count">
                    <HeartOutlined />
                    &nbsp;
                    {post.likesCount}
                </div>
                <div className="comments-count">
                    <CommentOutlined />
                    &nbsp;
                    {post.commentsCount}
                </div>
            </div>
        </div>
    );
}

export default SinglePost;