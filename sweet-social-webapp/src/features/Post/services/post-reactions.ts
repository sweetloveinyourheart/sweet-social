import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

interface PostReaction {
    liked: boolean
    saved: boolean
}

export async function likePost(postId: number) {
    const { data } = await axios.post(`${BASE_URL}/posts/like/${postId}`)
    return data
}

export async function dislikePost(postId: number) {
    const { data } = await axios.delete(`${BASE_URL}/posts/dislike/${postId}`)
    return data
}

export async function getPostReaction(postId: number): Promise<PostReaction> {
    const { data } = await axios.get(`${BASE_URL}/reactions/post/user-reaction/${postId}`)
    return data
}