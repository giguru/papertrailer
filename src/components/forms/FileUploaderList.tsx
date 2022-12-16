import React, {ChangeEvent, DragEvent, useRef, useState} from 'react';
import {FormProps} from "./Form";
import {FileUpload, FileUploadProps} from "./FileUploader";
import axios, {AxiosResponse} from "axios";
import {ApiFileInterface} from "../../api/models";
import Loader from "../loader/Loader";
import styles from './FileUploaderList.module.scss';
import {ServerResponse} from "../../api/api";
import {CheckCircleOutlineOutlined, Close, Warning} from "@mui/icons-material";
import {useDeleteFiles} from "../../api/hooks/files";


type Props = Pick<FormProps<{}>, 'endpoint'> & Pick<FileUploadProps, 'accept'> & {
    additionalData: Record<string, string>
}
type FileUploads = Record<number, string | Pick<ApiFileInterface, 'title'>>;
type FileErrors = Record<number, string>;

function FileUploaderList({ endpoint, accept, additionalData }: Props) {
    const fileUploadsRef = useRef<FileUploads>({})
    const fileErrorsRef = useRef<FileErrors>({})
    const [fileUploads, setFileUploads] = useState<FileUploads>({});
    const [fileErrors, setFileErrors] = useState<FileUploads>({});

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
            for (const additionalDataKey in additionalData) {
                fd.append(additionalDataKey, additionalData[additionalDataKey]);
            }
            fd.append('file', file);
            const key = i + initCount;
            fileUploadsRef.current[key] = file.name;
            axios
                .post<FormData, AxiosResponse<ServerResponse<ApiFileInterface>>>(endpoint, fd)
                .then((result) => {
                    fileUploadsRef.current[key] = result.data.data || { title: file.name }
                    setFileUploads({...fileUploadsRef.current});
                    delete fileErrorsRef.current[key];
                    setFileErrors({...fileErrorsRef.current})
                })
                .catch((e) => {
                    fileErrorsRef.current[key] = e.response.data?.message || e.message;
                    setFileErrors({...fileErrorsRef.current})
                })
        }
        setFileUploads({...fileUploadsRef.current});
    }

    const deleteListItem = (key: number) => {
        delete fileErrorsRef.current[key];
        delete fileUploadsRef.current[key];
        setFileUploads({...fileUploadsRef.current});
        setFileErrors({...fileErrorsRef.current})
    }

    return (
        <>
            <ul className={styles.UploadedList}>
                {Object.keys(fileUploads)
                    .map(key => Number(key))
                    .map((key) => {
                        const value = fileUploads[key];
                        const error = fileErrors[key];

                        return (
                            <div key={key} className={styles.UploadedItem}>
                                {!error && typeof value === 'string' && (
                                    <>
                                        <span className={styles.Icon}>
                                            <Loader size="inline" />
                                        </span>
                                        <span className={styles.Title}>&nbsp;Uploading: {value}</span>
                                    </>
                                )}
                                {error && typeof error === 'string' && (
                                    <>
                                        <span className={styles.Icon}>
                                            <Warning className="color" />
                                        </span>
                                        <span className={styles.Title}>
                                            <span>&nbsp;Error: </span>
                                            <span>{typeof value === 'string' ? value: value?.title}</span>
                                            <div>{error}</div>
                                            <div>
                                                <Close onClick={() => deleteListItem(key)} />
                                            </div>
                                        </span>
                                    </>
                                )}
                                {!error && typeof value === 'object' && value.title && (
                                    <>
                                        <CheckCircleOutlineOutlined className={styles.Icon} />
                                        <span className={styles.Title}>
                                            Completed upload:&nbsp;{value.title}
                                        </span>
                                    </>
                                )}
                            </div>
                        )
                    })}
            </ul>
            <FileUpload
                accept={accept}
                onChange={onChange}
                onDrop={onDrop}
                hoverLabel={(
                    <>
                        Click or drag to upload file.<br />
                        Accepted file types: &nbsp;
                        <strong className="colorPrimary">{accept}</strong>
                    </>
                )}
            />
        </>
    );
}

export default FileUploaderList;
