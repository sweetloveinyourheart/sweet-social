import { FunctionComponent, useEffect, useState } from "react";
import { BasicUserInfo, quickViewUser } from "../../../User/services/quick-view";
import { Avatar, Button, Col, Row, Skeleton, Typography, message } from "antd";
import { UserOutlined, MessageOutlined } from '@ant-design/icons'
import "../../styles/QuickView.scss"
import { followUser, unfollowUser } from "../../../User/services/interaction";

interface QuickViewProps {
    username: string
}

const QuickView: FunctionComponent<QuickViewProps> = ({ username }) => {
    const [user, setUser] = useState<BasicUserInfo | null>(null)

    useEffect(() => {
        (async () => {
            const data = await quickViewUser(username)
            setUser(data)
        })()
    }, [])

    const onFollow = async () => {
        try {
            if(!user) return;

            await followUser(user.id)

            setUser(s => s ? ({ ...s, followed: true }) : null)

            message.success(`You are following ${user.profile.username}`)
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        }
    }

    const onUnfollow = async () => {
        try {
            if(!user) return;

            await unfollowUser(user.id)

            setUser(s => s ? ({ ...s, followed: false }) : null)

            message.success(`You was unfollow ${user.profile.username}`)
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        }
    }

    return (
        user
            ? (
                <div className="quick-view">
                    <div className="user-info">
                        <div className="user-avatar">
                            <Avatar src={user.profile.avatar} icon={<UserOutlined />} size={50} />
                        </div>
                        <div className="user-name">
                            <Typography.Title level={5}>{user.profile.name}</Typography.Title>
                            <p>{user.profile.name}</p>
                        </div>
                    </div>
                    <div className="user-stats">
                        <Row>
                            <Col span={8}>
                                <div className="stats-value">
                                    <Typography.Title level={5}>
                                        {user.userStats.following}
                                    </Typography.Title>
                                    <span>Following</span>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="stats-value">
                                    <Typography.Title level={5}>
                                        {user.userStats.followers}
                                    </Typography.Title>
                                    <span>Followers</span>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="stats-value">
                                    <Typography.Title level={5}>
                                        {user.userStats.post}
                                    </Typography.Title>
                                    <span>Posts</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="actions">
                        <Row gutter={12}>
                            <Col span={12}>
                                <Button type="primary" icon={<MessageOutlined />}>Message</Button>
                            </Col>
                            <Col span={12}>
                                {user.followed
                                    ? <Button type="dashed" onClick={onUnfollow}>Unfollow</Button>
                                    : <Button type="default" onClick={onFollow}>Follow</Button>
                                }
                            </Col>
                        </Row>
                    </div>
                </div>
            )
            : (
                <Skeleton active paragraph={{ rows: 0 }} />
            )
    )
}

export default QuickView;