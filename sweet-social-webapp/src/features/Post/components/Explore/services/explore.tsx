import axios from "axios";
import { BASE_URL } from "../../../../../constants/base-url";

export async function explorePosts(page: number = 1, limit: number = 10): Promise<any> {
    const { data } = await axios.get(`${BASE_URL}/posts/explore/get-all?page=${page}&limit=${limit}`)
    return data
}