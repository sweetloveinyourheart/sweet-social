import { FunctionComponent, useEffect, useState } from "react";
import { Post, getSavedPosts } from "../../services/personal-post";
import { Col, Empty, Row } from "antd";
import '../../styles/PersonalPosts.scss'
import SinglePost from "./SinglePost";

interface SavedPostsProps { }

const SavedPosts: FunctionComponent<SavedPostsProps> = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        totalPages: 1
    })

    useEffect(() => {
        (async () => {
            const data = await getSavedPosts(pagination.page, pagination.limit)

            setPosts(data.items)
            setPagination(s => ({
                ...s,
                totalPages: data.meta.totalPages
            }))
        })()
    }, [pagination.page])

    const renderPosts = () => {
        return posts.map((post, index) => (
            <Col xs={24} sm={12} lg={8} key={`personal-post_${index}`}>
                <SinglePost post={post} />
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
                    <Empty description="No posts saved yet. Check back later for updates!" />
                )
            }
        </div>
    );
}

export default SavedPosts;