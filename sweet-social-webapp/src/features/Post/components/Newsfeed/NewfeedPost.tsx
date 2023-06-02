import { FunctionComponent } from "react";
import { PostDetail } from "../../services/get-post";
import PostHeader from "../PostDetail/PostHeader";
import { Carousel, Image } from "antd";
import PostReaction from "../PostDetail/PostReaction";
import { usePostViewer } from "../../contexts/PostViewer";

interface NewfeedPostProps {
    post: PostDetail
}

const NewfeedPost: FunctionComponent<NewfeedPostProps> = ({ post }) => {

    const { openPost } = usePostViewer()

    const onViewPost = () => {
        openPost(post.id)
    }

    return (
        <div className="newsfeed-post">
            <PostHeader post={post} />
            <Carousel>
                {post.medias.map((media, index) => (
                    <Image
                        width={"100%"}
                        src={media.mediaUrl}
                        key={`post-media-img_${index}`}
                        preview={false}
                        onClick={onViewPost}
                    />
                ))}
            </Carousel>
            <PostReaction post={post} onCommentClick={onViewPost}/>
            <div className="post-caption">
                <span>{post.user.profile.username}</span>
                {post.caption}
            </div>
            <div className="post-viewer" onClick={onViewPost}>
                View all comments
            </div>
        </div>
    );
}

export default NewfeedPost;