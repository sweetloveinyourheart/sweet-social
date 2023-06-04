import EmojiPicker from "emoji-picker-react";
import { FunctionComponent, useState } from "react";
import { SmileOutlined } from '@ant-design/icons'
import './Emoji.scss'

interface EmojiProps {
    onEmojiClick: (emojiStr: string) => void
}

const Emoji: FunctionComponent<EmojiProps> = ({ onEmojiClick }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div className="emoji-picker">
            <button type="button" onClick={() => setIsOpen(s => !s)}>
                <SmileOutlined />
            </button>
            <div className="picker-tab">
                {isOpen
                    ? <EmojiPicker onEmojiClick={(emoji) => onEmojiClick(emoji.emoji)} skinTonesDisabled />
                    : null
                }
            </div>
        </div>
    );
}

export default Emoji;