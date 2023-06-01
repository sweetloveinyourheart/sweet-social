import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";
import { Post } from "./personal-post";

export interface PostDetail extends Post {
    user: {
        id: number
        profile: {
            username: string,
            name: string,
            avatar: string,
        }
    }
}

export async function getPostById(id: number) {
    const { data } = await axios.get<PostDetail>(`${BASE_URL}/posts/get-by-id/${id}`)
    return data
}