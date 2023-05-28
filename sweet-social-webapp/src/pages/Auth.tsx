import { Layout } from "antd";
import { Outlet } from "react-router-dom";

function Auth() {
    return ( 
        <Layout className="auth">
            <Outlet />
        </Layout>
     );
}

export default Auth;