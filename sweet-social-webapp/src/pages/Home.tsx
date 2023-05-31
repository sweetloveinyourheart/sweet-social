import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../components/SideBar/SideBar";
import CreatePostWrapper from "../features/Creation/contexts/CreatePost";

function Home() {
    return (
        <CreatePostWrapper>
            <Layout style={{ background: "#fff", height: "100vh" }}>
                <SiderBar />
                <Layout style={{ background: "#fff", height: "100vh", overflowY: "scroll" }}>
                    <Outlet />
                </Layout>
            </Layout>
        </CreatePostWrapper>
    );
}

export default Home;