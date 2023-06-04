import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export interface Conversation {
    id: number,
    chatboxId: string,
    messages: ChatboxMessage[],
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

export async function getConversations(): Promise<Conversation[]> {
    const { data } = await axios.get(`${BASE_URL}/messages/list`)
    return data
}

export async function getChatboxData(chatboxId: string): Promise<Conversation> {
    const { data } = await axios.get(`${BASE_URL}/messages/data/${chatboxId}`)
    return data
}