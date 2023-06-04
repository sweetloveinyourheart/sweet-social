import { ChangeEvent, FunctionComponent, useState, useTransition } from "react";
import "../styles/SearchUsers.scss"
import { Avatar, Divider, Empty, Input, Spin, Typography } from "antd";
import { SearchUser, searchUser } from "../services/search-user";
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";

interface SearchUsersProps {

}

const SearchUsers: FunctionComponent<SearchUsersProps> = () => {
    const [pattern, setPattern] = useState("")
    const [results, setResults] = useState<SearchUser[]>([]);

    const [pending, startTransition] = useTransition();
    const navigate = useNavigate()

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setPattern(value)

        if(value.length === 0) {
            setResults([])
            return;
        }

        const data = await searchUser(value)

        startTransition(() => {
            setResults(data);
        })
    }

    const handleClick = (username: string) => {
        navigate(`/u/${username}`)
    }

    return (
        <div className="search-users">
            <div className="search-form">
                <Input
                    value={pattern}
                    onChange={handleChange}
                    placeholder="Seach user by username, name ..."
                />
            </div>
            <Divider />
            {pending
                ? <Spin />
                : (
                    <div className="user-list">
                        {results.map((user, index) => (
                            <div className="user" key={`user_${index}`} onClick={() => handleClick(user.profile.username)}>
                                <div className="avatar">
                                    <Avatar size={45} src={user.profile.avatar} icon={<UserOutlined />} />
                                </div>
                                <div className="info">
                                    <Typography.Title level={5}>
                                        {user.profile.username}
                                    </Typography.Title>
                                    <Typography.Text>
                                        {user.profile.name}
                                    </Typography.Text>
                                </div>
                            </div>
                        ))}
                        {results.length === 0
                            ? <Empty description="Nothing here !" />
                            : null
                        }
                    </div>
                )
            }
        </div>
    );
}

export default SearchUsers;