import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export interface SignupBody {
    email: string,
    password: string,
    profile: {
        name: string,
        username: string
    }
}

export interface SigninBody {
    email: string,
    password: string,
}

export interface OAuthBody {
    token: string
}

interface AuthResponse {
    accessToken: string
    refreshToken: string
}

interface MessageResponse {
    message: string
}

export async function signup(body: SignupBody): Promise<AuthResponse> {
    const { data } = await axios.post(`${BASE_URL}/auth/sign-up`, body)
    return data
}

export async function oauth(body: OAuthBody): Promise<AuthResponse> {
    const { data } = await axios.post(`${BASE_URL}/auth/oauth`, body)
    return data
}


export async function signin(body: SigninBody): Promise<AuthResponse> {
    const { data } = await axios.post(`${BASE_URL}/auth/sign-in`, body)
    return data
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data } = await axios.get(`${BASE_URL}/auth/refresh-token?token=${refreshToken}`)
    return data
}

export async function verifyToken(token: string): Promise<MessageResponse> {
    const { data } = await axios.get(`${BASE_URL}/auth/verify-account?token=${token}`)
    return data
}

export async function signout(refreshToken: string): Promise<MessageResponse> {
    const { data } = await axios.delete(`${BASE_URL}/auth/sign-out?token=${refreshToken}`)
    return data
}