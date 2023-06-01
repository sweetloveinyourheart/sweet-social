import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export interface BasicUser {
    id: number
    profile: {
        username: string
        name: string
        avatar: string | null
    }
}

export async function getSuggestedAccounts() {
    const { data } = await axios.get<BasicUser[]>(`${BASE_URL}/users/famous-users`)
    return data
}