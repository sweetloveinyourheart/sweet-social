import { FunctionComponent, useEffect, useState } from "react";
import { Post, getPersonalPosts } from "../services/personal-post";
import { Col, Empty, Row } from "antd";
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import '../styles/PersonalPosts.scss'
import { usePostViewer } from "../contexts/PostViewer";

interface PersonalPostsProps { }

const PersonalPosts: FunctionComponent<PersonalPostsProps> = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        totalPages: 1
    })

    const { openPost } = usePostViewer()

    useEffect(() => {
        (async () => {
            const data = await getPersonalPosts(pagination.page, pagination.limit)

            setPosts(data.items)
            setPagination(s => ({
                ...s,
                totalPages: data.meta.totalPages
            }))
        })()
    }, [pagination.page])

    const renderPosts = () => {
        return posts.map((post, index) => (
            <Col span={8} key={`personal-post_${index}`}>
                <div className="post" onClick={() => openPost(post)}>
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
                            {post.likesCount}
                        </div>
                    </div>
                </div>
            </Col>
        ))
    }

    return (
        <div className="personal-posts">
            {posts.length !== 0
                ? (
                    <Row gutter={4}>
                        {renderPosts()}
                    </Row>
                )
                : (
                    <Empty description="No posts uploaded yet. Check back later for updates!" />
                )
            }
        </div>
    );
}

export default PersonalPosts;