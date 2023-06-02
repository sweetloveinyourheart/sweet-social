import axios from "axios";
import { BASE_URL } from "../../../constants/base-url";
import { BasicUserInfo } from "./quick-view";

export async function getSuggestedAccounts() {
    const { data } = await axios.get<BasicUserInfo[]>(`${BASE_URL}/users/famous-users`)
    return data
}