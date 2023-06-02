import { FunctionComponent, useEffect, useState } from "react";
import { Post } from "../../../services/personal-post";
import { explorePosts } from "../services/explore";
import { Col, Row, Skeleton } from "antd";
import SinglePost from "../../PersonalPosts/SinglePost";

interface ExploreProps {

}

const Explore: FunctionComponent<ExploreProps> = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        totalPages: 1
    })
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getNewsFeedData = async () => {
        try {
            const data = await explorePosts(pagination.page, pagination.limit)
            setPosts(data.items)
            setPagination(s => ({
                ...s,
                totalPages: data.meta.totalPages
            }))
        } catch (error) {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getNewsFeedData()
    }, [])

    return (
        <div className="main-area">
            {loading
                ? <Skeleton active />
                : (
                    <Row gutter={4}>
                        {
                            posts.map((post, index) => (
                                <Col span={8} key={`personal-post_${index}`}>
                                    <SinglePost post={post} />
                                </Col>
                            ))
                        }
                    </Row>
                )
            }
        </div>
    );
}

export default Explore;