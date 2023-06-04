import { createContext, useCallback, useContext, useState } from "react";
import PostDetail from "../components/PostDetail/PostDetail";
import { PostDetail as PostDetailInterface, getPostById } from "../services/get-post";

interface PostViewer {
    openPost: (postId: number) => void
    closePost: () => void
}

const PostViewerContext = createContext({} as PostViewer)

export function usePostViewer() {
    return useContext(PostViewerContext)
}

export default function PostViewerProvider({ children }: { children: any }) {
    const [post, setPost] = useState<PostDetailInterface | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const openPost = useCallback(async (postId: number) => {
        try {
            const data = await getPostById(postId)
            setPost(data)
            setIsOpen(true)
        } catch (error) {
            setIsOpen(false)
        }
    }, [])

    const closePost = useCallback(() => {
        setIsOpen(false)
        setPost(null)
    }, [])

    return (
        <PostViewerContext.Provider value={{ openPost, closePost }}>
            {children}
            {(isOpen && post) ? <PostDetail isOpen={isOpen} handleClose={closePost} post={post} /> : null}
        </PostViewerContext.Provider>
    )
}