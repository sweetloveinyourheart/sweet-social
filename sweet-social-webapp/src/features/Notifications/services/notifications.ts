import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export interface Notification {
    content: string,
    createdAt: Date,
    isRead: boolean,
    post: {
        id: number
    },
    sender: {
        id: number,
        profile: {
            username: string,
            name: string,
            avatar: string
        }
    }
}  

export async function getNotifications(): Promise<Notification[]> {
    const { data } = await axios.get(`${BASE_URL}/notifications`)
    return data
}