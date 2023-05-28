import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

interface Profile {
    username: string
    name: string
    avatar: string | null
    bio: string | null
    gender: Gender | null
}

export interface UserProfile {
    email: string
    isVerified: boolean
    profile: Profile
}

export async function getUserProfile(): Promise<UserProfile> {
    const { data } = await axios.get(`${BASE_URL}/users/profile`)
    return data
}

export async function updateProfile(profile: Profile): Promise<{ message: string }> {
    const { data } = await axios.put(`${BASE_URL}/users/update/profile`, profile)
    return data
}