import { Avatar, Button, Col, Row, Typography, message } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import "../styles/SuggestedAccount.scss"
import { BasicUser, getSuggestedAccounts } from "../services/recommend";
import { followUser, unfollowUser } from "../services/interaction";

interface SuggestedAccountProps { }

const SuggestedAccount: FunctionComponent<SuggestedAccountProps> = () => {
    const [accounts, setAccounts] = useState<{ followed: boolean, account: BasicUser }[]>([])

    useEffect(() => {
        (async () => {
            const data = await getSuggestedAccounts()
            const accountList = data.map((acc) => ({
                followed: false,
                account: acc
            }))
            setAccounts(accountList)            
        })()
    }, [])

    const onFollow = async (user: BasicUser, index: number) => {
        try {
            await followUser(user.id)

            let current = [...accounts]
            current[index].followed = true
            setAccounts(current)

            message.success(`You are following ${user.profile.username}`)
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        }
    }

    const onUnfollow = async (user: BasicUser, index: number) => {
        try {
            await unfollowUser(user.id)

            let current = [...accounts]
            current[index].followed = false
            setAccounts(current)
            
            message.success(`You was unfollow ${user.profile.username}`)
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        }
    }

    return (
        <div className="suggested-accounts">
            <h5 className="suggested-accounts__header">
                Suggested for you
            </h5>
            {accounts.map((item, index) => (
                <div className="account" key={`suggested-account_${index}`}>
                    <Row>
                        <Col span={4}>
                            <Avatar size={"large"} src={item.account.profile.avatar} />
                        </Col>
                        <Col span={16}>
                            <div className="account-info">
                                <Typography.Title level={5}>
                                    {item.account.profile.username}
                                </Typography.Title>
                                <p>
                                    {item.account.profile.name}
                                </p>
                            </div>
                        </Col>
                        <Col span={4}>
                            {item.followed
                                ? (
                                    <div className="account-follow">
                                        <Button type="link" onClick={() => onUnfollow(item.account, index)}>
                                            Unfollow
                                        </Button>
                                    </div>
                                )
                                : (
                                    <div className="account-follow" onClick={() => onFollow(item.account, index)}>
                                        <Button type="link">
                                            Follow
                                        </Button>
                                    </div>
                                )
                            }
                        </Col>
                    </Row>
                </div>
            ))}
        </div>
    );
}

export default SuggestedAccount;