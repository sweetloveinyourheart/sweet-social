import { FunctionComponent, useState } from "react";
import { Button, Layout, Menu, MenuProps, Typography } from 'antd'
import {
    HomeOutlined,
    SearchOutlined,
    CompassOutlined,
    MessageOutlined,
    NotificationOutlined,
    PlusCircleOutlined,
    UserOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import "./SideBar.scss"
import Logo from "../Logo/Logo";
import { useCreation } from "../../features/Creation/contexts/CreatePost";
import Notifications from "../../features/Notifications/components/Notifications";
import SearchUsers from "../../features/Search/components/SearchUsers";

const { Sider } = Layout

interface SiderBarProps { }

enum SidebarBoxMode {
    Close,
    Notification,
    Search
}

const SiderBar: FunctionComponent<SiderBarProps> = () => {
    const [sidebarBoxMode, setSidebarBoxMode] = useState<SidebarBoxMode>(SidebarBoxMode.Close)

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { openCreationBox } = useCreation()

    const onOpenNotification = () => {
        setSidebarBoxMode(SidebarBoxMode.Notification)
    }

    const onOpenSearch = () => {
        setSidebarBoxMode(SidebarBoxMode.Search)
    }

    const siderItems = [
        {
            path: '/',
            icon: <HomeOutlined />,
            label: "Home"
        },
        {
            path: '/search',
            icon: <SearchOutlined />,
            label: "Search",
            action: onOpenSearch
        },
        {
            path: '/explore',
            icon: <CompassOutlined />,
            label: "Explore"
        },
        {
            path: '/messages',
            icon: <MessageOutlined />,
            label: "Messages"
        },
        {
            path: '/notifications',
            icon: <NotificationOutlined />,
            label: "Notifications",
            action: onOpenNotification
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
                    if (item.action) {
                        item.action()
                    }
                    else {
                        setSidebarBoxMode(SidebarBoxMode.Close)
                        navigate(item.path)
                    }
                }
            };
        },
    );

    const renderSidebarBoxContent = () => {
        switch (sidebarBoxMode) {
            case SidebarBoxMode.Notification:
                return <Notifications />
            
            case SidebarBoxMode.Search:
                return <SearchUsers />

            default:
                return null
        }
    }

    return (
        <>
            <Sider
                width={280}
                className="sidebar"
                trigger={null}
                collapsible
                collapsed={sidebarBoxMode !== SidebarBoxMode.Close}
            >
                <Logo small={sidebarBoxMode !== SidebarBoxMode.Close} style={{ fontSize: 36, padding: '24px' }} />
                <Menu
                    mode="inline"
                    selectedKeys={[pathname]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={items}
                    className="sidebar-menu"
                />
                <div className={"sidebar-box" + ` ${sidebarBoxMode !== SidebarBoxMode.Close ? "sidebar-box--active" : ""}`}>
                    <div className="sidebar-box-title">
                        <Typography.Title level={4}>
                            {sidebarBoxMode === SidebarBoxMode.Notification && "Notifications"}
                            {sidebarBoxMode === SidebarBoxMode.Search && "Search"}
                        </Typography.Title>
                        <Button icon={<CloseOutlined />} type="link" onClick={() => setSidebarBoxMode(SidebarBoxMode.Close)}/>
                    </div>
                    {renderSidebarBoxContent()}
                </div>
            </Sider>
        </>
    );
}

export default SiderBar;