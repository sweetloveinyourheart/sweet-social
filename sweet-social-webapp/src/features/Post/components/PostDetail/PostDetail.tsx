import { FunctionComponent, useCallback, useState } from "react";
import { Avatar, Button, Carousel, Col, Image, Modal, Row, Typography } from "antd";
import "../../styles/PostDetail.scss"
import { PostDetail as PostDetailInterface } from "../../services/get-post";
import Comment from "./Comment";
import { PostComment } from "../../services/post-comment";
import moment from "moment";
import { HeartOutlined, CommentOutlined, BookOutlined } from '@ant-design/icons'
import CommentBox from "./CommentBox";


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
                        <div className="detail__header">
                            <div className="author">
                                <Row>
                                    <Col span={3}>
                                        <Avatar src={post.user.profile.avatar} />
                                    </Col>
                                    <Col span={18}>
                                        <div className="author__desc">
                                            <Typography.Title level={5}>
                                                {post.user.profile.username}
                                            </Typography.Title>
                                            <div className="dot">
                                                •
                                            </div>
                                            <Button type="link">Follow</Button>
                                        </div>
                                    </Col>
                                    <Col span={3}>
                                        <div className="settings">
                                            <Button type="link">•••</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div className="detail__comments">
                            <div className="abc">
                                <Comment cmt={ownerCmt} />
                                {comments.map((cmt, index) => (
                                    <Comment cmt={cmt} key={`cmt_${index}`} />
                                ))}
                            </div>
                        </div>
                        <div className="detail__footer">
                            <div className="reaction">
                                <div className="behavior">
                                    <div className="behavior__left">
                                        <button>
                                            <HeartOutlined />
                                        </button>
                                        <button>
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
                            <CommentBox addComment={addComment} />
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

export default PostDetail;