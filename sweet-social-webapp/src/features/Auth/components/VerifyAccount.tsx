import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLoading from "../../../components/Loading/PageLoading";
import { Button, Result } from "antd";
import { verifyToken } from "../services/auth";

interface VerifyAccountProps {
    
}
 
const VerifyAccount: FunctionComponent<VerifyAccountProps> = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [result, setResult] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            setLoading(true)
            const token = searchParams.get('token')
            if (token) {
                try {
                    const { message } = await verifyToken(token)
                    setResult(message)
                } catch (error: any) {
                    setError(error.response?.data?.message || `An error occurred: ${error.message}`)
                }
            } else {
                navigate('/')
            }
            setLoading(false)
        })()
    }, [])

    if (loading) return <PageLoading />

    return (
        result
            ? (
                <Result
                    title="Your account has been activated"
                    status={"success"}
                    extra={
                        <Button type="primary" key="console" onClick={() => navigate('/')}>
                            Go Home
                        </Button>
                    }
                    className="auth-result"
                />
            )
            : (
                <Result
                    title={error}
                    status={"error"}
                    extra={
                        <Button type="primary" key="console" onClick={() => navigate('/')}>
                            Go Home
                        </Button>
                    }
                    className="auth-result"
                />
            )

    );
}
 
export default VerifyAccount;