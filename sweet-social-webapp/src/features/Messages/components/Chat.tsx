import { FormEvent, FunctionComponent, createRef, useEffect, useState } from "react";
import { useChat } from "./Messages";
import { useSocket } from "../../Socket/SocketProvider";
import "../styles/Chat.scss"
import { Avatar, Col, Input, Row, Typography, message } from "antd";
import { ChatboxMessage, Conversation, getChatboxData } from "../services/conversations";
import { UserOutlined, SmileOutlined, SendOutlined } from '@ant-design/icons'
import { useUser } from "../../User/contexts/UserContext";
import ChatMessage from "./ChatMessage";

interface ChatProps { }

const Chat: FunctionComponent<ChatProps> = () => {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<ChatboxMessage[]>([])
    const [content, setContent] = useState<string>("")

    const { chatboxId } = useChat()
    const { socket } = useSocket()
    const { user } = useUser()

    const messagesEndRef = createRef<HTMLDivElement>()

    useEffect(() => {
        (async () => {
            try {
                const data = await getChatboxData(chatboxId)
                setConversation(data)
                setMessages(data.messages)

            } catch (error) {
                message.error("An error has occurred !")
            }
        })()

        socket.emit('join-chatbox', { chatboxId })

        socket.on('user-joined', (payload: any) => {
            message.info(`${payload.username} is active now`)
        })

        socket.on('message-received', (payload: any) => {
            const message: ChatboxMessage = payload.message
            
            setMessages(s => [...s, message])
        })

        socket.on('user-left', (payload: any) => {
            message.info(`${payload.username} has left`)
        })

        return () => {
            socket.emit('leave-chatbox', { chatboxId })
        }

    }, [])

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    const getSenderProfile = () => {
        if (!conversation || !user) return null

        const sender = conversation.members.find((member) => member.profile.username !== user.profile.username)

        return sender?.profile || null
    }

    const onSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user) return;

        const newMsg: ChatboxMessage = {
            id: 0,
            user,
            content,
            createdAt: new Date()
        }

        socket.emit('send-message', { chatboxId, content })
        setMessages(s => [...s, newMsg])
        setContent("")
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="chatbox">
            <div className="chatbox-header">
                <div className="user">
                    <Avatar icon={<UserOutlined />} src={getSenderProfile()?.avatar} />
                    <Typography.Title level={5}>
                        {getSenderProfile()?.username}
                    </Typography.Title>
                </div>
            </div>
            <div className="chat">
                {messages.map((msg, index) => (
                    <ChatMessage
                        message={msg}
                        key={`chat-msg_${index}`}
                        isMyMsg={msg.user.profile.username === user?.profile.username}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-box">
                <form className="chat-form" onSubmit={onSendMessage}>
                    <Row>
                        <Col span={3}>
                            <button className="icon" type="button">
                                <SmileOutlined />
                            </button>
                        </Col>
                        <Col span={18}>
                            <Input
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Message ..."
                            />
                        </Col>
                        <Col span={3}>
                            <button className="icon" type="submit">
                                <SendOutlined />
                            </button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
}

export default Chat;