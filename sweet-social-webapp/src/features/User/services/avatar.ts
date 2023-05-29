import axios from "axios"
import { BASE_URL } from "../../../constants/base-url"

export async function updateAvatar(formData: FormData): Promise<{ message: string }> {
    const { data } = await axios.put(`${BASE_URL}/users/update/avatar`, formData)
    return data
}