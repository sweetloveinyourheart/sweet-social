import { Layout } from "antd";
import { Outlet } from "react-router-dom";

function AuthPage() {
    return ( 
        <Layout className="auth">
            <Outlet />
        </Layout>
     );
}

export default AuthPage;