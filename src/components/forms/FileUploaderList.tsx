import React, {ChangeEvent, DragEvent, useState} from 'react';
import Form, {FormProps} from "./Form";
import {FileUpload, FileUploadProps} from "./FileUploader";
import axios from "axios";

type Props = Pick<FormProps<{}>, 'endpoint'> & Pick<FileUploadProps, 'accept'>

function FileUploaderList({ endpoint, accept }: Props) {
    const [uploadedFiles] = useState();

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
        console.log(files)
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const fd = new FormData();
            fd.append('file', file);
            axios.post(endpoint, fd)
                .then(console.log)
        }
    }

    return (
        <>
            <FileUpload accept={accept} onChange={onChange} onDrop={onDrop} />
        </>
    );
}

export default FileUploaderList;
