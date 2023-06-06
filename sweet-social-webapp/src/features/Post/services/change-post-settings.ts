
import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export async function changePostVisibility(postId: number, visibility: boolean) {
    const { data } = await axios.post(`${BASE_URL}/posts/change-settings/${postId}`, { isPublic: visibility })
    return data
}