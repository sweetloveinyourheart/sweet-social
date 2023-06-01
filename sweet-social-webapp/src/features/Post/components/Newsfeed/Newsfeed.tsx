import { FunctionComponent, useEffect, useState } from "react";
import { getNewsfeedPosts } from "../../services/newsfeed-post";
import { PostDetail } from "../../services/get-post";
import "../../styles/Newfeed.scss"
import NewfeedPost from "./NewfeedPost";

interface NewsfeedProps { }
 
const Newsfeed: FunctionComponent<NewsfeedProps> = () => {
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 16,
        totalPages: 1
    })
    const [posts, setPosts] = useState<PostDetail[]>([])

    useEffect(() => {
        (async () => {
            const data = await getNewsfeedPosts()
            setPosts(data.items)
            setPagination(s => ({
                ...s,
                totalPages: data.meta.totalPages
            }))
        })()
    }, [])

    return (  
        <div className="newsfeed">
            {posts.map((post, index) => (
                <NewfeedPost post={post} key={`newsfeed-post_${index}`} />
            ))}
        </div>
    );
}
 
export default Newsfeed