import { Avatar } from "antd";
import { FunctionComponent } from "react";
import { PostComment } from "../../services/post-comment";
import moment from "moment";
import { UserOutlined } from '@ant-design/icons';

interface CommentsProps {
    cmt: PostComment
}

const Comment: FunctionComponent<CommentsProps> = ({ cmt }) => {
    return (
        <div className="comment">
            <div className="comment-avatar">
                <Avatar src={cmt.user.profile.avatar} icon={<UserOutlined />} />
            </div>

            <div>
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
            </div>
        </div>
    );
}

export default Comment;