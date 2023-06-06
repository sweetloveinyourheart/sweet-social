import { FunctionComponent, useEffect, useState } from "react";
import { getNewsfeedPosts } from "../../services/newsfeed-post";
import { PostDetail } from "../../services/get-post";
import "../../styles/Newfeed.scss"
import NewfeedPost from "./NewfeedPost";
import { Empty, Skeleton } from "antd";

interface NewsfeedProps { }

const Newsfeed: FunctionComponent<NewsfeedProps> = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        totalPages: 1
    })
    const [posts, setPosts] = useState<PostDetail[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const getNewsFeedData = async () => {
        try {
            const data = await getNewsfeedPosts(pagination.page, pagination.limit)
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
        loading
            ? <Skeleton active paragraph={{ rows: 5 }} />
            : (
                <div className="newsfeed">
                    {posts.map((post, index) => (
                        <NewfeedPost post={post} key={`newsfeed-post_${index}`} />
                    ))}
                    {posts.length == 0
                        ? <Empty description="Nothing here! You can follow some user first to see their posts" />
                        : null
                    }
                </div>
            )
    );
}

export default Newsfeed