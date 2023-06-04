import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export interface SearchUser {
    id: number,
    profile: {
        username: string,
        name: string,
        avatar: string
    }
}

export async function searchUser(pattern: string) {
    const { data } = await axios.get<SearchUser[]>(`${BASE_URL}/users/search?pattern=${pattern}`)
    return data
}