import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../components/SideBar/SideBar";

function Home() {
    return (
        <Layout style={{ background: "#fff", height: "100vh" }}>
            <SiderBar />
            <Layout style={{ background: "#fff" }}>
                <Outlet />
            </Layout>
        </Layout>
    );
}

export default Home;