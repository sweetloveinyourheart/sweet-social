import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export async function removeConversation(chatboxId: string): Promise<any> {
    const { data } = await axios.delete(`${BASE_URL}/messages/remove/${chatboxId}`)
    return data
}
