import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export interface BasicUserInfo {
    id: 0,
    profile: {
        username: string,
        name: string,
        avatar: string
    },
    userStats: {
        post: 0,
        followers: 0,
        following: 0
    },
    followed: boolean
}

export async function quickViewUser(username: string): Promise<BasicUserInfo> {
    const { data } = await axios.get(`${BASE_URL}/users/quick-view/${username}`)
    return data
}
