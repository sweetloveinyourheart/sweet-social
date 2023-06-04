import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../components/SideBar/SideBar";
import CreatePostWrapper from "../features/Creation/contexts/CreatePost";
import PostViewerProvider from "../features/Post/contexts/PostViewer";
import SocketProvider from "../features/Socket/SocketProvider";
import ReminderProvider from "../features/Reminder/contexts/RemiderProvider";

function MainPage() {
    return (
        <SocketProvider>
            <PostViewerProvider>
                <ReminderProvider>
                    <CreatePostWrapper>

                        <Layout style={{ background: "#fff", height: "100vh" }}>
                            <SiderBar />
                            <Layout style={{ background: "#fff", height: "100vh", overflowY: "scroll" }}>
                                <Outlet />
                            </Layout>
                        </Layout>

                    </CreatePostWrapper>
                </ReminderProvider>
            </PostViewerProvider>
        </SocketProvider>
    );
}

export default MainPage;