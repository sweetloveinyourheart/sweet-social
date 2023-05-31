import { Button, Modal, Typography, UploadFile, message } from "antd";
import { FunctionComponent, useCallback, useState } from "react";
import "../styles/CreationBox.scss"
import Uploader from "./Uploader";
import PostEditor from "./PostEditor";
import { createPost } from "../services/create-post";

interface CreationBoxProps {
    isOpen: boolean
    handleCancel: () => void
}

export interface PostSettings {
    caption: string;
    canComment: boolean;
    isPublic: boolean;
    showLikeAndViewCounts: boolean;
}

enum CreateStep {
    SelectImage,
    WriteCaption
}

const initialPostSetting = {
    caption: "",
    canComment: true,
    isPublic: true,
    showLikeAndViewCounts: true
}

const CreationBox: FunctionComponent<CreationBoxProps> = ({ isOpen, handleCancel }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [originalFileList, setOriginalFileList] = useState<UploadFile[]>([]);
    const [postSettings, setPostSettings] = useState<PostSettings>(initialPostSetting)
    const [creationStep, setCreationStep] = useState<CreateStep>(CreateStep.SelectImage);
    const [loading, setLoading] = useState<boolean>(false)

    const onNextStepClick = () => {
        setCreationStep(CreateStep.WriteCaption)
    }

    const onPreStepClick = () => {
        setCreationStep(CreateStep.SelectImage)
    }

    const onPostSettingsChange = useCallback((name: keyof PostSettings, value: any) => {
        setPostSettings(s => ({
            ...s,
            [name]: value
        }))
    }, [])

    const reset = () => {
        setFileList([])
        setPostSettings(initialPostSetting)
    }

    const onSubmit = async () => {
        try {
            setLoading(true)

            const formData = new FormData()

            formData.append("caption", postSettings.caption)
            formData.append("canComment", String(postSettings.canComment))
            formData.append("isPublic", String(postSettings.isPublic))
            formData.append("showLikeAndViewCounts", String(postSettings.showLikeAndViewCounts))

            originalFileList.forEach((file) => {
                formData.append("medias", file as any)
            })

            await createPost(formData)

            message.success("Your post has been uploaded !")
            reset() // reset post data
            handleCancel() // close modal
        } catch (error: any) {
            message.error(error.response?.data?.message || `An error occurred: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal
                title={(
                    <div className="creation-box-header">
                        <Typography.Title level={5}>
                            Create new post
                        </Typography.Title>
                        {creationStep === CreateStep.SelectImage
                            ? (
                                <Button type="primary" disabled={fileList.length === 0} onClick={onNextStepClick}>
                                    Next
                                </Button>)
                            : null
                        }
                        {creationStep === CreateStep.WriteCaption
                            ? (
                                <div>
                                    <Button
                                        type="default"
                                        onClick={onPreStepClick}
                                        disabled={loading}
                                    >
                                        Previous
                                    </Button>
                                    &nbsp;
                                    <Button
                                        type="primary"
                                        onClick={onSubmit}
                                        loading={loading}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            )
                            : null
                        }
                    </div>
                )}
                open={isOpen}
                closable={false}
                onCancel={handleCancel}
                footer={null}
                centered
                width={creationStep === CreateStep.WriteCaption ? 800 : undefined}
            >
                {creationStep === CreateStep.SelectImage
                    ? <Uploader fileList={fileList}  setFileList={setFileList} originalFileList={originalFileList} setOriginalFileList={setOriginalFileList} />
                    : null
                }
                {creationStep === CreateStep.WriteCaption
                    ? <PostEditor fileList={fileList} postSettings={postSettings} onPostSettingsChange={onPostSettingsChange} />
                    : null
                }
            </Modal>
        </>
    );
}

export default CreationBox;