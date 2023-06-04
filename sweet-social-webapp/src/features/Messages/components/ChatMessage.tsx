import { FunctionComponent } from "react";
import { ChatboxMessage } from "../services/conversations";
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons'
import "../styles/ChatMessage.scss"

interface ChatMessageProps {
    message: ChatboxMessage
    isMyMsg: boolean
}

const ChatMessage: FunctionComponent<ChatMessageProps> = ({ message, isMyMsg }) => {
    return (
        <div className={isMyMsg ? "chat-message chat-message--right" : "chat-message"}>
            <div className="my-msg">
                <div className="avatar">
                    <Avatar icon={<UserOutlined />} src={message.user.profile.avatar} />
                </div>
                <div className="content">
                    {message.content}
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;