import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../components/SideBar/SideBar";
import CreatePostWrapper from "../features/Creation/contexts/CreatePost";
import PostViewerProvider from "../features/Post/contexts/PostViewer";
import SocketProvider from "../features/Socket/SocketProvider";

function MainPage() {
    return (
        <SocketProvider>
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
        </SocketProvider>
    );
}

export default MainPage;