import { createContext, useCallback, useContext, useState } from "react";
import PostDetail from "../components/PostDetail/PostDetail";
import { Post } from "../services/personal-post";
import { PostDetail as PostDetailInterface, getPostById } from "../services/get-post";

interface PostViewer {
    openPost: (postData: Post) => void
}

const PostViewerContext = createContext({} as PostViewer)

export function usePostViewer() {
    return useContext(PostViewerContext)
}

export default function PostViewerProvider({ children }: { children: any }) {
    const [post, setPost] = useState<PostDetailInterface | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openPost = useCallback(async (postData: Post) => {
        try {
            const data = await getPostById(postData.id)
            setPost(data)
            setIsOpen(true)
        } catch (error) {
            setIsOpen(false)
        }
    }, [])

    const handleClose = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <PostViewerContext.Provider value={{ openPost }}>
            {children}
            {(isOpen && post) ? <PostDetail isOpen={isOpen} handleClose={handleClose} post={post} /> : null}
        </PostViewerContext.Provider>
    )
}