import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export async function followUser(userId: number) {
    const { data } = await axios.post(`${BASE_URL}/users/follow/${userId}`)
    return data
}

export async function unfollowUser(userId: number) {
    const { data } = await axios.delete(`${BASE_URL}/users/unfollow/${userId}`)
    return data
}