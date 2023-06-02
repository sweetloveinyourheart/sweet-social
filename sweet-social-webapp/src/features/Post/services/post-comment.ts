import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export interface PostComment {
    content: string
    createdAt: Date
    user: {
        id: number
        profile: {
            avatar: string | null
            username: string
            name: string
        }
    }
}

export async function getPostComments(postId: number, page: number = 1, limit: number = 10) {
    const { data } = await axios.get(`${BASE_URL}/reactions/post/comments/${postId}?page=${page}&limit=${limit}`)
    return data
}

export async function commentOnPost(postId: number, content: string) {
    const { data } = await axios.post(`${BASE_URL}/posts/comment/${postId}`, { content })
    return data
}