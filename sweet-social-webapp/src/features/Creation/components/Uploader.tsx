import { Dispatch, FunctionComponent } from "react";
import ImgCrop from 'antd-img-crop';
import { Upload, UploadFile } from "antd";
import { DropboxOutlined } from '@ant-design/icons';

interface UploaderProps {
    fileList: UploadFile[],
    originalFileList: UploadFile[],
    setFileList: Dispatch<React.SetStateAction<UploadFile<any>[]>>
    setOriginalFileList: Dispatch<React.SetStateAction<UploadFile<any>[]>>
}

const { Dragger } = Upload;

const Uploader: FunctionComponent<UploaderProps> = ({ fileList, originalFileList, setFileList, setOriginalFileList }) => {

    const handleCropped = async (file: UploadFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(file as any);

        // save the origin file list to upload later
        setOriginalFileList((prev: any) => [
            ...prev,
            file
        ]);

        // take the uploaded file url to display images list
        reader.onload = () => {
            const fileData = { 
                url: reader.result, 
                uid: file.uid, 
                name: file.name, 
                size: file.size, type: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate
            }

            setFileList((prev: any) => [
                ...prev,
                fileData
            ]);
        };

        // then upload `file` from the argument manually
        return false;
    }

    const onRemove = (file: UploadFile) => {
        const index = fileList.indexOf(file);

        const newFileList = fileList.slice();
        const newOriginalFileList = originalFileList.slice();

        newFileList.splice(index, 1);
        newOriginalFileList.splice(index, 1)

        setFileList(newFileList);
        setOriginalFileList(newOriginalFileList)
    }

    return (
        <ImgCrop aspect={4 / 5}>
            <Dragger
                fileList={fileList}
                beforeUpload={handleCropped}
                listType="picture"
                className="creation-uploader"
                onRemove={onRemove}
            >
                <p className="ant-upload-drag-icon">
                    <DropboxOutlined />
                </p>
                <p className="ant-upload-text">Drag photos and videos here</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
        </ImgCrop>
    );
}

export default Uploader;