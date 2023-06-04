import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export interface ChatboxInfo {
    id: number,
    chatboxId: string,
    members: [
        {
            id: number
            profile: {
                username: string,
                name: string,
                avatar: string
            }
        }
    ],
    createdAt: Date
}

export interface ChatboxMessage {
    id: number,
    content: string,
    user: {
        id: number
        profile: {
            username: string,
            name: string,
            avatar: string | null
        }
    },
    createdAt: Date
}

export interface Conversation extends ChatboxInfo {
    messages: ChatboxMessage[]
}

export async function getConversations(): Promise<Conversation[]> {
    const { data } = await axios.get(`${BASE_URL}/messages/list`)
    return data
}

export async function getChatboxInfo(chatboxId: string): Promise<Conversation> {
    const { data } = await axios.get(`${BASE_URL}/messages/info/${chatboxId}`)
    return data
}

export async function getChatboxMessages(chatboxId: string, page: number = 1, limit: number = 25) {
    const { data } = await axios.get(`${BASE_URL}/messages/get-all/${chatboxId}?page=${page}&limit=${limit}`)
    return data
}