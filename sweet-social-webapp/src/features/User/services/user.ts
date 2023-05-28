import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

export interface UserProfile {
    email: string
    isVerified: boolean
    profile: {
        username: string
        name: string
        avatar: string | null
        bio: string | null
        gender: Gender | null
    }
}

export async function getUserProfile(): Promise<UserProfile> {
    const { data } = await axios.get(`${BASE_URL}/users/profile`)
    return data
}