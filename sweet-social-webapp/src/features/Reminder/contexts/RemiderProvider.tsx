import { notification } from "antd";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../Socket/SocketProvider";
import { usePostViewer } from "../../Post/contexts/PostViewer";

const ReminderContext = createContext({})

export default function ReminderProvider({ children }: { children: any }) {
    const [api, contextHolder] = notification.useNotification();

    const { socket } = useSocket()
    const { openPost } = usePostViewer()
    const navigate = useNavigate()

    const openPostReminder = (postId: number, type: string) => {
        api['success']({
            message: 'New post reaction',
            description:
                'A friend ' + type + ' your post. Click to go to the post.',
            onClick: () => openPost(postId)
        });
    };

    const openMessageReminder = (chatboxId: string) => {
        api['success']({
            message: 'New message !',
            description:
                'You have new message from your friend. Click to go to the conversation.',
            onClick: () => navigate(`/messages/${chatboxId}`)
        });
    };

    useEffect(() => {
        socket.on('received-post-reminder', (payload: { type: "like" | "comment" , postId: number }) => {
            openPostReminder(payload.postId, payload.type) 
            console.log("Received");
            
        })

        socket.on('received-message-reminder', (payload: { chatboxId: string }) => {
            openMessageReminder(payload.chatboxId)
        })
    }, [])

    return (
        <ReminderContext.Provider value={{}}>
            {children}
            {contextHolder}
        </ReminderContext.Provider>
    )
}