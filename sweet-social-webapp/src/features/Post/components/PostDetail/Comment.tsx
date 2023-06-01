import { Avatar, Col, Row } from "antd";
import { FunctionComponent } from "react";
import { PostComment } from "../../services/post-comment";
import moment from "moment";

interface CommentsProps {
    cmt: PostComment
}

const Comment: FunctionComponent<CommentsProps> = ({ cmt }) => {
    return (
        <div className="comment">
            <Row>
                <Col span={3}>
                    <Avatar src={cmt.user.profile.avatar} />
                </Col>
                <Col span={21}>
                    <p className="content">
                        <span >
                            {cmt.user.profile.username}
                        </span>
                        {cmt.content}
                    </p>
                    <p className="counter">
                        <span>
                            {moment(cmt.createdAt).fromNow()}
                        </span>
                        <span>
                            See translation
                        </span>
                    </p>
                </Col>
            </Row>
        </div>
    );
}

export default Comment;