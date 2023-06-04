import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";

export async function connectToSingleChatbox(recipientId: number): Promise<{chatboxId: string}> {
    const { data } = await axios.post(`${BASE_URL}/messages/connect`, { recipientId })
    return data
}