import { FunctionComponent, useEffect, useState } from "react";
import { Notification, getNotifications } from "../services/notifications";
import { Avatar, Empty } from "antd";
import "../styles/Notifications.scss"
import moment from "moment";
import { usePostViewer } from "../../Post/contexts/PostViewer";
import { UserOutlined } from '@ant-design/icons'

interface NotificationsProps {

}

const Notifications: FunctionComponent<NotificationsProps> = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const { openPost } = usePostViewer()

    useEffect(() => {
        (async () => {
            const data = await getNotifications()
            setNotifications(data)
        })()
    }, [])

    const onGoToPost = (postId: number) => {
        openPost(postId)
    }

    return (
        <div className="notifications">
            {notifications.length === 0
                ? <Empty description="There are no comments yet!"/>
                : null
            }
            {notifications.map((noti, key) => (
                <div className="notification" key={`noti_${key}`} onClick={() => onGoToPost(noti.post.id)}>
                    <div className="sender-avatar">
                        <Avatar size={45} icon={<UserOutlined />} src={noti.sender.profile.avatar} />
                    </div>
                    <div className="content">
                        <div className="finn">
                            <span>{noti.sender.profile.username}</span>
                            {noti.content}
                        </div>
                        <div className="timestamp">
                            {moment(noti.createdAt).fromNow()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Notifications;