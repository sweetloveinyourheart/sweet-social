import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export async function createPost(formData: FormData) {
    const { data } = await axios.post(`${BASE_URL}/posts/new`, formData)
    return data
}