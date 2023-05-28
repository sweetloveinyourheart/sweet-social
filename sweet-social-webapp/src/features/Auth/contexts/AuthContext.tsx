import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearRefreshToken, getRefreshToken, saveRefreshToken } from "../utils/cookies";
import axios from "axios";
import { SigninBody, SignupBody, refreshToken, signin, signout, signup } from "../services/auth";
import PageLoading from "../../../components/Loading/PageLoading";

interface Auth {
    accessToken: string | null,
    error: string | null,
    loading: boolean,
    login: (user: SigninBody) => Promise<boolean>,
    register: (newUser: SignupBody) => Promise<boolean>,
    logout: () => Promise<void>
}

const AuthContext = createContext({} as Auth)

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: any }) {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const login = useCallback(async (user: SigninBody) => {
        try {
            setLoading(true)
            const { accessToken, refreshToken } = await signin(user)

            setError(null)
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            setAccessToken(accessToken)
            saveRefreshToken(refreshToken)
            return true
        } catch (error: any) {
            setError(error.response?.data?.message || `An error occurred: ${error.message}`)
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    const register = useCallback(async (newUser: SignupBody) => {
        try {
            setLoading(true)
            const { accessToken, refreshToken } = await signup(newUser)

            setError(null)
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            setAccessToken(accessToken)
            saveRefreshToken(refreshToken)
            return true
        } catch (error: any) {
            setError(error.response?.data?.message || `An error occurred: ${error.message}`)
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        setAccessToken(null)
        const rfToken = getRefreshToken()
        if (rfToken) await signout(rfToken)
        clearRefreshToken()
    }, [])


    useEffect(() => {
        const rfToken = getRefreshToken()
        if (!rfToken) {
            setLoading(false)
            return;
        }

        // gain access_token
        (async () => {
            try {
                const { accessToken } = await refreshToken(rfToken)
                if (!accessToken) {
                    setAccessToken(null)
                    setLoading(false)
                    return;
                }

                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                setAccessToken(accessToken)
            } catch (error) {
                setAccessToken(null)
            } finally {
                setLoading(false)
            }
        })()

        // refresh token every 10 minute
        const timer = setInterval(async () => {
            try {
                const token = await refreshToken(rfToken)
                if (!token) {
                    clearInterval(timer)
                    setAccessToken(null)
                    return;
                }
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                setAccessToken(accessToken)
            } catch (error) {
                clearInterval(timer)
                setAccessToken(null)
            }
        }, 10 * 60 * 1000);

        return () => clearInterval(timer);
    }, [])

    const memoedValue = useMemo(() => ({
        accessToken,
        loading,
        error,
        login,
        register,
        logout
    }), [accessToken, loading, error])

    if (loading) return <PageLoading />;

    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    )
}