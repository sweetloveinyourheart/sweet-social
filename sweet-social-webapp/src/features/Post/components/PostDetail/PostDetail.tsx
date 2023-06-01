import { FunctionComponent, useCallback, useState } from "react";
import { Carousel, Col, Image, Modal, Row } from "antd";
import "../../styles/PostDetail.scss"
import { PostDetail as PostDetailInterface } from "../../services/get-post";
import Comment from "./Comment";
import { PostComment } from "../../services/post-comment";
import CommentBox from "./CommentBox";
import PostHeader from "./PostHeader";
import PostReaction from "./PostReaction";


interface PostDetailProps {
    isOpen: boolean
    handleClose: () => void
    post: PostDetailInterface
}

const PostDetail: FunctionComponent<PostDetailProps> = ({ isOpen, handleClose, post }) => {
    const [comments, setComments] = useState<PostComment[]>([])

    const ownerCmt: PostComment = {
        content: post.caption,
        createdAt: post.createdAt,
        user: post.user
    }

    const addComment = useCallback(async (comment: PostComment) => {
        setComments(s => [...s, comment])
    }, [])

    return (
        <Modal
            open={isOpen}
            closable={false}
            onCancel={handleClose}
            footer={null}
            centered
            width={1080}
            className="post-detail"
        >
            <Row>
                <Col span={14}>
                    <Carousel>
                        {post.medias.map((media, index) => (
                            <Image
                                width={"100%"}
                                src={media.mediaUrl}
                                key={`post-media-img_${index}`}
                                preview={false}
                            />
                        ))}
                    </Carousel>
                </Col>
                <Col span={10}>
                    <div className="detail">
                        <PostHeader post={post} />
                        <div className="detail__comments">
                            <div className="abc">
                                <Comment cmt={ownerCmt} />
                                {comments.map((cmt, index) => (
                                    <Comment cmt={cmt} key={`cmt_${index}`} />
                                ))}
                            </div>
                        </div>
                        <div className="detail__footer">
                            <PostReaction post={post} />
                            <CommentBox addComment={addComment} />
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

export default PostDetail;