import { FunctionComponent } from "react";
import { Layout, Menu, MenuProps } from 'antd'
import { 
    HomeOutlined, 
    SearchOutlined, 
    CompassOutlined, 
    MessageOutlined, 
    YoutubeOutlined, 
    NotificationOutlined, 
    PlusCircleOutlined,
    UserOutlined 
} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import "./SideBar.scss"
import Logo from "../Logo/Logo";
import { useCreation } from "../../features/Creation/contexts/CreatePost";

const { Sider } = Layout

interface SiderBarProps {}

const SiderBar: FunctionComponent<SiderBarProps> = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { openCreationBox } = useCreation()

    const siderItems = [
        {
            path: '/',
            icon: <HomeOutlined />,
            label: "Home"
        },
        {
            path: '/search',
            icon: <SearchOutlined />,
            label: "Search"
        },
        {
            path: '/explore',
            icon: <CompassOutlined />,
            label: "Explore"
        },
        {
            path: '/reels',
            icon: <YoutubeOutlined />,
            label: "Reels"
        },
        {
            path: '/message',
            icon: <MessageOutlined />,
            label: "Messages"
        },
        {
            path: '/notifications',
            icon: <NotificationOutlined />,
            label: "Notifications"
        },
        {
            path: '/create',
            icon: <PlusCircleOutlined />,
            label: "Create",
            action: openCreationBox
        },
        {
            path: '/profile',
            icon: <UserOutlined />,
            label: "Profile"
        },
    ]

    const items: MenuProps['items'] = siderItems.map(
        (item) => {
            return {
                key: item.path,
                icon: item.icon,
                label: item.label,
                onClick: () => {
                    item.action
                        ? item.action()
                        : navigate(item.path)
                }
            };
        },
    );

    return (
        <Sider width={280} className="sidebar">
            <Logo style={{ fontSize: 36, padding: '24px' }} />
            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                style={{ height: '100%', borderRight: 0 }}
                items={items}
                className="sidebar-menu"
            />
        </Sider>
    );
}

export default SiderBar;