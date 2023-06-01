import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../components/SideBar/SideBar";
import CreatePostWrapper from "../features/Creation/contexts/CreatePost";
import PostViewerProvider from "../features/Post/contexts/PostViewer";

function MainPage() {
    return (
        <CreatePostWrapper>
            <PostViewerProvider>
                <Layout style={{ background: "#fff", height: "100vh" }}>
                    <SiderBar />
                    <Layout style={{ background: "#fff", height: "100vh", overflowY: "scroll" }}>
                        <Outlet />
                    </Layout>
                </Layout>
            </PostViewerProvider>
        </CreatePostWrapper>
    );
}

export default MainPage;