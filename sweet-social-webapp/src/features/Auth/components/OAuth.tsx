import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "antd";
import { FunctionComponent } from "react";
import { GoogleCircleFilled } from '@ant-design/icons';
import { OAuthBody } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";

interface OAuthProps {
    loading: boolean
}

const OAuth: FunctionComponent<OAuthProps> = ({ loading }) => {
    const { googleLogin } = useAuth()

    const oauthLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
            if(tokenResponse.access_token) {
                const body: OAuthBody = { token: tokenResponse.access_token }
                await googleLogin(body)
            }
        },
    });

    return (
        <Button
            type="link"
            htmlType="button"
            className="oauth-btn-link"
            icon={<GoogleCircleFilled />}
            disabled={loading}
            onClick={oauthLogin}
        >
            Login with Google
        </Button>
    );
}

export default OAuth;