import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Auth/contexts/AuthContext";
import { UserProfile, getUserProfile } from "../services/user";
import PageLoading from "../../../components/Loading/PageLoading";
import { useLocation, useNavigate } from "react-router-dom";

interface UserContext {
    user: UserProfile | null
    refreshUserData: () => Promise<void>
}

const UserContext = createContext({} as UserContext)

export function useUser() {
    return useContext(UserContext)
}

export default function UserProvider({ children }: { children: any }) {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const { accessToken } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const getUser = async () => {
        try {
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
            // If user is verifying account, just go to the verify page
            if(location.pathname.includes('/auth/verify')) {
                setLoading(false)
                return;
            }

            // If the user has not verified their account yet, redirect them to the new account page.
            navigate('/auth/new-account')
            setLoading(false)
        }

        if (!user && !accessToken) {
            navigate('/auth/sign-in')
            setLoading(false)
        }
    }, [user])

    const memoedValue = useMemo(() => ({
        user,
        refreshUserData: getUser
    }), [user])

    if (loading) return <PageLoading />

    return (
        <UserContext.Provider value={memoedValue}>
            {children}
        </UserContext.Provider>
    )
}