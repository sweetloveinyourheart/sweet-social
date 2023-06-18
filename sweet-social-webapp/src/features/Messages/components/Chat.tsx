import { FormEvent, FunctionComponent, createRef, useEffect, useState } from "react";
import { useChat } from "./Messages";
import { useSocket } from "../../Socket/SocketProvider";
import "../styles/Chat.scss"
import { Avatar, Col, Divider, Input, Row, Typography, message } from "antd";
import { ChatboxMessage, ChatboxInfo, getChatboxInfo, getChatboxMessages } from "../services/conversations";
import { UserOutlined, SendOutlined } from '@ant-design/icons'
import { useUser } from "../../User/contexts/UserContext";
import ChatMessage from "./ChatMessage";
import moment from "moment";
import Emoji from "../../../components/Emoji/Emoji";

interface ChatProps { }

const Chat: FunctionComponent<ChatProps> = () => {
    const [currentChatbox, setCurrentChatbox] = useState<string>("")
    const [info, setInfo] = useState<ChatboxInfo | null>(null)
    const [messages, setMessages] = useState<ChatboxMessage[]>([])
    const [content, setContent] = useState<string>("")

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        totalPages: 1
    })
    const [loadingPrevious, setLoadingPrevious] = useState<boolean>(false)

    const { chatboxId } = useChat()
    const { socket } = useSocket()
    const { user } = useUser()

    const chatboxRef = createRef<HTMLDivElement>()
    const messagesEndRef = createRef<HTMLDivElement>()

    const fetchMessages = async () => {
        if (currentChatbox === chatboxId) {
            // Fetch more if the chat box id not change
            const msgData = await getChatboxMessages(chatboxId, pagination.page, pagination.limit)

            const reverseMsgData = msgData.items.reverse()
            setMessages(s => [...reverseMsgData, ...s])

            setPagination(s => ({
                ...s,
                page: ++s.page,
                totalPages: msgData.meta.totalPages
            }))
        } else {
            // If the box chat id change, refetch start at page 1

            const msgData = await getChatboxMessages(chatboxId, 1, pagination.limit)

            const reverseMsgData = msgData.items.reverse()
            setMessages(reverseMsgData)

            setPagination({
                page: 1,
                limit: 25,
                totalPages: msgData.meta.totalPages
            })
        }
    }

    console.log(pagination);
    

    useEffect(() => {
        (async () => {
            try {
                setLoadingPrevious(true)

                const data = await getChatboxInfo(chatboxId)
                setInfo(data)

                await fetchMessages()
                setCurrentChatbox(chatboxId)

            } catch (error) {
                message.error("An error has occurred !")
            } finally {
                setLoadingPrevious(false)
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

    }, [chatboxId])

    useEffect(() => {
        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

        // Check if scrolled to the top of the chat box
        chatboxRef.current?.addEventListener('scroll', () => {
            const chatBoxElement = chatboxRef.current;

            if (chatBoxElement?.scrollTop === 0) {
                if (pagination.page <= pagination.totalPages) {
                    fetchMessages()
                }
            }
        })
    }, [messages])

    const getSenderProfile = () => {
        if (!info || !user) return null

        const sender = info.members.find((member) => member.profile.username !== user.profile.username)

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

    const renderMessages = () => {
        let currDate = new Date();
        let lastDate = new Date();

        let currDiff = 0

        return messages.map((msg, index) => {
            lastDate = new Date(msg.createdAt)

            // Calculate the time difference in milliseconds
            let timeDiff = currDate.getTime() - lastDate.getTime();

            // Calculate the number of days
            let daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

            const canShowDiff = () => {
                if (daysDiff !== currDiff) {
                    currDiff = daysDiff
                    return true
                }

                return false
            }

            return (
                <div key={`chat-msg_${index}`}>
                    {canShowDiff()
                        ? <Divider className="days-diff">{moment(lastDate).fromNow()}</Divider>
                        : null
                    }
                    <ChatMessage
                        message={msg}
                        isMyMsg={msg.user.profile.username === user?.profile.username}
                    />
                </div>
            )
        })
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
            <div className="chat" ref={chatboxRef}>
                {loadingPrevious
                    ? (
                        <div className="loading">
                            Loading more message
                        </div>
                    ) : null
                }
                {renderMessages()}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-box">
                <form className="chat-form" onSubmit={onSendMessage}>
                    <Row>
                        <Col span={3}>
                            <Emoji onEmojiClick={(emoji) => setContent(s => s + emoji)} />
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