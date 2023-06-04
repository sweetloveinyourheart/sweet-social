import { FunctionComponent, useEffect, useState } from "react";
import "../styles/Messages.scss"
import { Button, Result, Typography, message } from "antd";
import { useUser } from "../../User/contexts/UserContext";
import { DeleteOutlined, MessageOutlined, ReloadOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Conversation, getConversations } from "../services/conversations";
import ConversationItem from "./Conversation";
import { removeConversation } from "../services/delete-conversation";

interface MessagesProps { }

type ChatContextType = { chatboxId: string };

export function useChat() {
    return useOutletContext<ChatContextType>()
}

const Messages: FunctionComponent<MessagesProps> = () => {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConvs, setSeletedConvs] = useState<string | undefined>()

    const { user } = useUser()
    const { chatboxId } = useParams()
    const navigate = useNavigate()

    const loadConversation = async () => {
        try {
            const convs = await getConversations()
            setConversations(convs)

        } catch (error) {
            setConversations([])
        }
    }

    useEffect(() => {
        loadConversation()
    }, [])

    useEffect(() => {
        setSeletedConvs(chatboxId)
    }, [chatboxId])

    const onRemoveConversation = async () => {
        try {
            if (selectedConvs) {
                await removeConversation(selectedConvs)

                let currConvs = [...conversations]
                currConvs = currConvs.filter(el => el.chatboxId !== selectedConvs)
                setConversations(currConvs)

                message.success('Conversation was deleted !')
                navigate('/messages')
            }
        } catch (error) {
            message.error("An error has occurred !")
        }
    }

    return (
        <div className="main-area">
            <div className="messages-window">
                <div className="users-list">
                    <div className="myself">
                        <div className="myself-dummy">
                            <Button onClick={loadConversation} icon={<ReloadOutlined />} />
                        </div>
                        <Typography.Title level={4}>
                            {user?.profile.username}
                        </Typography.Title>
                        <div className="myself-dummy">
                            {selectedConvs ? <Button onClick={onRemoveConversation} icon={<DeleteOutlined />} /> : null}
                        </div>
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