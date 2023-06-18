import { FunctionComponent, useEffect, useState } from "react";
import { Post, getPersonalPosts, getPostsByUsername } from "../../services/personal-post";
import { Col, Empty, Row } from "antd";
import '../../styles/PersonalPosts.scss'
import SinglePost from "./SinglePost";

interface PersonalPostsProps {
    username?: string
}

const PersonalPosts: FunctionComponent<PersonalPostsProps> = ({ username }) => {
    const [posts, setPosts] = useState<Post[]>([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        totalPages: 1
    })

    useEffect(() => {
        (async () => {
            if(username) {
                var data = await getPostsByUsername(username)
            } else {
                var data = await getPersonalPosts(pagination.page, pagination.limit)
            }

            setPosts(data.items)
            setPagination(s => ({
                ...s,
                totalPages: data.meta.totalPages
            }))
        })()
    }, [pagination.page, username])

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
                    <Empty description="No posts uploaded yet. Check back later for updates!" />
                )
            }
        </div>
    );
}

export default PersonalPosts;