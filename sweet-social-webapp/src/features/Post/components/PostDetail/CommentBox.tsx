import { Col, Input, Row } from "antd";
import { FormEvent, FunctionComponent, useState } from "react";
import { SmileOutlined, SendOutlined } from '@ant-design/icons'
import { PostComment } from "../../services/post-comment";
import { useUser } from "../../../User/contexts/UserContext";

interface CommentBoxProps {
    addComment: (comment: PostComment) => Promise<void>
}

const CommentBox: FunctionComponent<CommentBoxProps> = ({ addComment }) => {
    const [content, setContent] = useState<string>("")
    const { user } = useUser()

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!user) return;

        const newCmt: PostComment = {
            user,
            content,
            createdAt: new Date
        }

        await addComment(newCmt)
        setContent("")
    }

    return (
        <div className="comment-box">
            <Row>
                <Col span={2}>
                    <button className="icon">
                        <SmileOutlined />
                    </button>
                </Col>
                <Col span={20}>
                    <form onSubmit={onSubmit}>
                        <Input 
                            value={content}
                            placeholder="Leave a comment" 
                            onChange={e => setContent(e.target.value)}
                        />
                    </form>
                </Col>
                <Col span={2}>
                    <button className="send">
                        <SendOutlined />
                    </button>
                </Col>
            </Row>
        </div>
    );
}

export default CommentBox;