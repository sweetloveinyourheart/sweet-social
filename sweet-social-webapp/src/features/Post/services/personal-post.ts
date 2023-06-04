import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export interface Media {
    id: number
    mediaType: "image" | "video"
    mediaUrl: string
}

export interface Post {
    id: number
    caption: string
    commentsCount: number
    createdAt: Date
    likesCount: number
    medias: Media[]
}

export async function getPersonalPosts(page: number = 1, limit: number = 10) {
    const { data } = await axios.get(`${BASE_URL}/posts/personal/get-all?page=${page}&limit=${limit}`)
    return data
}

export async function getPostsByUsername(username: string) {
    const { data } = await axios.get<any>(`${BASE_URL}/posts/user/${username}`)
    return data
}

export async function getSavedPosts(page: number = 1, limit: number = 10) {
    const { data } = await axios.get(`${BASE_URL}/posts/saved/get-all?page=${page}&limit=${limit}`)
    return data
}