import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export async function getNewsfeedPosts(page: number = 1, limit: number = 10) {
    const { data } = await axios.get(`${BASE_URL}/posts/newsfeed/get-all?page=${page}&limit=${limit}`)
    return data
}