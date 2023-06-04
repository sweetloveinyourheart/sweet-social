import { FunctionComponent } from "react";
import { Conversation } from "../services/conversations";
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Typography } from "antd";
import { UserProfile } from "../../User/services/user";
import "../styles/Conversation.scss"
import { useNavigate } from "react-router-dom";

interface ConversationItemProps {
    user: UserProfile | null
    conversation: Conversation
    active: boolean
}

const ConversationItem: FunctionComponent<ConversationItemProps> = ({ user, conversation, active }) => {

    const navigate = useNavigate()

    const getSenderProfile = () => {
        const sender = conversation.members.find((member) => member.profile.username !== user?.profile.username)

        return sender?.profile
    }

    const onClick = () => {
        navigate(`/messages/${conversation.chatboxId}`)
    }

    return (
        <div
            className={`${active ? "conversation conversation--active" : "conversation"}`}
            onClick={onClick}
        >
            <div className="avatar">
                <Avatar
                    icon={<UserOutlined />}
                    src={getSenderProfile()?.avatar}
                    size={50}
                />
            </div>
            <div className="info">
                <Typography.Title level={5}>
                    {getSenderProfile()?.username || "Unknow user"}
                </Typography.Title>
                <p>
                    {conversation.messages.length !== 0 ? conversation.messages[0].content : "Let say hi to your friend"}
                </p>
            </div>
        </div>
    );
}

export default ConversationItem;