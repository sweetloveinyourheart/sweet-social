import { FunctionComponent, useEffect, useState } from "react";
import "../styles/Messages.scss"
import { Button, Result, Typography } from "antd";
import { useUser } from "../../User/contexts/UserContext";
import { EditOutlined, MessageOutlined } from '@ant-design/icons'
import { Outlet, useOutletContext, useParams } from "react-router-dom";
import { Conversation, getConversations } from "../services/conversations";
import ConversationItem from "./Conversation";

interface MessagesProps { }

type ChatContextType = { chatboxId: string };

export function useChat() {
    return useOutletContext<ChatContextType>()
}

const Messages: FunctionComponent<MessagesProps> = () => {
    const [conversations, setConversations] = useState<Conversation[]>([])

    const { user } = useUser()
    const { chatboxId } = useParams()

    useEffect(() => {
        (async () => {
            try {
                const convs = await getConversations()
                setConversations(convs)
                console.log(convs);
                
            } catch (error) {
                setConversations([])
            }
        })()
    }, [])

    useEffect(() => {
    }, [chatboxId])

    return (
        <div className="main-area">
            <div className="messages-window">
                <div className="users-list">
                    <div className="myself">
                        <div className="myself-dummy"></div>
                        <Typography.Title level={4}>
                            {user?.profile.username}
                        </Typography.Title>
                        <Button icon={<EditOutlined />} />
                    </div>
                    <div className="conversations">
                        {conversations.map((convs, index) => (
                            <ConversationItem
                                conversation={convs}
                                user={user}
                                active={convs.chatboxId === chatboxId}
                                key={`convs_${index}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="messages-box">
                    {chatboxId
                        ? <Outlet context={{ chatboxId }} />
                        : (
                            <Result
                                title="Your messages"
                                subTitle="Send private messages to a friend or group."
                                icon={<MessageOutlined />}
                                className="init-msg"
                            />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Messages;