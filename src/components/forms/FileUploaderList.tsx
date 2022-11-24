import React, {ChangeEvent, DragEvent, useRef, useState} from 'react';
import {FormProps} from "./Form";
import {FileUpload, FileUploadProps} from "./FileUploader";
import axios, {AxiosResponse} from "axios";
import {ApiFileInterface} from "../../api/models";
import Loader from "../loader/Loader";
import styles from './FileUploaderList.module.scss';
import {ServerResponse} from "../../api/api";
import {CheckCircleOutlineOutlined} from "@mui/icons-material";


type Props = Pick<FormProps<{}>, 'endpoint'> & Pick<FileUploadProps, 'accept'>

type fileUploads = Record<number, string | Pick<ApiFileInterface, 'title'>>;

function FileUploaderList({ endpoint, accept }: Props) {
    const fileUploadsRef = useRef<fileUploads>({})
    const [fileUploads, setFileUploads] = useState<fileUploads>({});

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target?.files instanceof FileList && e.target.files;

        if (files && files?.length) {
            startUpload(files);
        }
    }
    const onDrop = (e: DragEvent<HTMLElement>) => {
        const files = e.dataTransfer?.files instanceof FileList && e.dataTransfer.files;
        if (files && files?.length) {
            startUpload(files);
        }
    }
    const startUpload = (files: FileList) => {
        const initCount = Object.keys(fileUploads).length;
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const fd = new FormData();
            fd.append('file', file);
            const key = i + initCount;
            fileUploadsRef.current[key] = file.name;
            axios.post<FormData, AxiosResponse<ServerResponse<ApiFileInterface>>>(endpoint, fd)
                .then((result) => {
                    fileUploadsRef.current[key] = result.data.data || { title: file.name }
                    setFileUploads({...fileUploadsRef.current});
                })
        }
        setFileUploads({...fileUploadsRef.current});
    }

    return (
        <>
            <ul className={styles.UploadedList}>
                {Object.values(fileUploads).map((value, idx) => {
                    return (
                        <div key={idx} className={styles.UploadedItem}>
                            {typeof value === 'string' && (
                                <>
                                <span className={styles.Icon}>
                                    <Loader size="inline" />
                                </span>
                                    <span className={styles.Title}>&nbsp;Uploading: {value}</span>
                                </>
                            )}
                            {typeof value === 'object' && value.title && (
                                <>
                                    <CheckCircleOutlineOutlined className={styles.Icon} />
                                    <span className={styles.Title}>
                                    Completed upload:
                                        &nbsp;
                                        {value.title}
                                </span>
                                </>
                            )}
                        </div>
                    )
                })}
            </ul>
            <FileUpload accept={accept} onChange={onChange} onDrop={onDrop} />
        </>
    );
}

export default FileUploaderList;
