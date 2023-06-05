import { FunctionComponent, useEffect, useState } from "react";
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
    const [expand, setExpand] = useState<boolean>(true)
    const [lockSidebar, setLockSidebar] = useState(false)

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { openCreationBox } = useCreation()

    useEffect(() => {
        window.addEventListener('resize', () => {
            const windowW = window.innerWidth
            if (windowW <= 1200) {
                setExpand(false)
                setLockSidebar(true)
            } else {
                setExpand(true)
                setLockSidebar(false)
            }
        });
    }, [])

    const onOpenNotification = () => {
        setSidebarBoxMode(SidebarBoxMode.Notification)
        !lockSidebar && setExpand(false)
    }

    const onOpenSearch = () => {
        setSidebarBoxMode(SidebarBoxMode.Search)
        !lockSidebar && setExpand(false)
    }

    const onClose = () => {
        setSidebarBoxMode(SidebarBoxMode.Close)
        !lockSidebar && setExpand(true)
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
                        !lockSidebar && setExpand(true)
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
                collapsed={!expand}
            >
                <Logo small={!expand} style={{ fontSize: 36, padding: '24px' }} />
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
                        <Button icon={<CloseOutlined />} type="link" onClick={onClose} />
                    </div>
                    {renderSidebarBoxContent()}
                </div>
            </Sider>
        </>
    );
}

export default SiderBar;