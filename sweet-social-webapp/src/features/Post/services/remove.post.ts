import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export async function removePost(postId: number) {
    const { data } = await axios.delete(`${BASE_URL}/posts/personal/remove/${postId}`)
    return data
}