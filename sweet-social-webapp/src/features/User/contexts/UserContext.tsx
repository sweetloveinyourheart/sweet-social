import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Auth/contexts/AuthContext";
import { UserProfile, getUserProfile } from "../services/user";
import PageLoading from "../../../components/Loading/PageLoading";
import { useNavigate } from "react-router-dom";

interface UserContext {
    user: UserProfile | null
}

const UserContext = createContext({} as UserContext)

export function useUser() {
    return useContext(UserContext)
}

export default function UserProvider({ children }: { children: any }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { accessToken } = useAuth()
    const navigate = useNavigate()

    const getUser = async () => {
        try {
            setLoading(true)
            const userData = await getUserProfile()
            setUser(userData)
        } catch (error) {
            navigate('/auth/sign-in')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (accessToken) {
            getUser()
        }
    }, [accessToken])


    useEffect(() => {
        if (user && !user.isVerified) {
            navigate('/auth/new-account')
        }
    }, [user])

    const memoedValue = useMemo(() => ({
        user
    }), [user])

    if (loading) return <PageLoading />

    return (
        <UserContext.Provider value={memoedValue}>
            {children}
        </UserContext.Provider>
    )
}