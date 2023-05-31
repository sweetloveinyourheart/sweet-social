import { Avatar, Carousel, Col, Image, Input, Row, Switch, Typography, UploadFile } from "antd";
import { FunctionComponent, useState } from "react";
import { useUser } from "../../User/contexts/UserContext";
import "../styles/PostEditor.scss"
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { PostSettings } from "./CreationBox";

interface PostEditorProps {
    fileList: UploadFile[]
    postSettings: PostSettings
    onPostSettingsChange: (name: keyof PostSettings, value: any) => void
}

const PostEditor: FunctionComponent<PostEditorProps> = ({ fileList, postSettings, onPostSettingsChange }) => {
    const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false)

    const { user } = useUser()

    return (
        <>
            <Row gutter={12}>
                <Col span={14}>
                    <Carousel>
                        {fileList.map((file, index) => (
                            <Image
                                width={"100%"}
                                src={file.url}
                                key={`post-img_${index}`}
                            />
                        ))}
                    </Carousel>
                </Col>
                <Col span={10}>
                    <div className="post-description">
                        <div className="post-author">
                            <Avatar src={user?.profile.avatar} />
                            <Typography.Title level={5}>
                                {user?.profile.username}
                            </Typography.Title>
                        </div>
                        <div className="post-caption">
                            <Input.TextArea
                                rows={7}
                                placeholder="Write a caption ..."
                                value={postSettings.caption}
                                onChange={e => onPostSettingsChange("caption", e.target.value)}
                                maxLength={2200}
                            />
                        </div>
                        <div className="post-utils">
                            <div className="icon-picker"></div>
                            <span className="caption-counter">{postSettings.caption.length}/2.200</span>
                        </div>
                        <div className="post-settings">
                            <div className="setting-header" onClick={() => setIsSettingOpen(s => !s)}>
                                <Typography.Title level={5}>Advance settings</Typography.Title>
                                {isSettingOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
                            </div>
                            {isSettingOpen
                                ? (
                                    <>
                                        <div className="setting-item">
                                            <div className="setting-item__header">
                                                <Typography.Title level={5}>
                                                    Turn off commenting
                                                </Typography.Title>
                                                <Switch defaultChecked={false} onChange={val => onPostSettingsChange("canComment", !val)} />
                                            </div>
                                            <p>
                                                User cannot comment on your post.
                                            </p>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-item__header">
                                                <Typography.Title level={5}>
                                                    Hide this post
                                                </Typography.Title>
                                                <Switch defaultChecked={false} onChange={val => onPostSettingsChange("isPublic", !val)} />
                                            </div>
                                            <p>
                                                Only you will see this post.
                                            </p>
                                        </div>
                                        <div className="setting-item">
                                            <div className="setting-item__header">
                                                <Typography.Title level={5}>
                                                    Hide like and view counts
                                                </Typography.Title>
                                                <Switch defaultChecked={false} onChange={val => onPostSettingsChange("showLikeAndViewCounts", !val)} />
                                            </div>
                                            <p>
                                                Like and view counts not be displayed. You can change this later by going to the ··· menu
                                            </p>
                                        </div>
                                    </>
                                )
                                : null
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default PostEditor;