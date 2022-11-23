import React, {ChangeEvent, DragEvent, useState} from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CloudUpload} from "@mui/icons-material";
import cx from "classnames";
import classes from './FileUploader.module.scss'

export type FileUploadProps = {
    imageButton?: boolean
    accept: string
    hoverLabel?: string
    dropLabel?: string
    width?: string
    height?: string
    backgroundColor?: string
    image?: {
        url: string
        imageStyle?: {
            width?: string
            height?: string
        }
    }
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onDrop: (event: DragEvent<HTMLElement>) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
                                                          accept,
                                                          imageButton = false,
                                                          hoverLabel = 'Click or drag to upload file',
                                                          dropLabel = 'Drop file here',
                                                          width = '600px',
                                                          height = '100px',
                                                          backgroundColor = '#fff',
                                                          onChange,
                                                          onDrop,
                                                      }) => {
    const [labelText, setLabelText] = useState<string>(hoverLabel || '')
    const [isDragOver, setIsDragOver] = useState<boolean>(false)
    const [isMouseOver, setIsMouseOver] = useState<boolean>(false)
    const stopDefaults = (e: React.DragEvent) => {
        e.stopPropagation()
        e.preventDefault()
    }
    const dragEvents = {
        onMouseEnter: () => {
            setIsMouseOver(true)
        },
        onMouseLeave: () => {
            setIsMouseOver(false)
        },
        onDragEnter: (e: DragEvent) => {
            stopDefaults(e)
            setIsDragOver(true)
            setLabelText(dropLabel || '')
        },
        onDragLeave: (e: DragEvent) => {
            stopDefaults(e)
            setIsDragOver(false)
            setLabelText(hoverLabel || '')
        },
        onDragOver: stopDefaults,
        onDrop: (e: DragEvent<HTMLElement>) => {
            stopDefaults(e)
            setLabelText(hoverLabel || '')
            setIsDragOver(false)
            e.persist()
            onDrop(e)
        },
    }

    return (
        <>
            <input
                onChange={onChange}
                accept={accept}
                className="hidden"
                id="file-upload"
                type="file"
            />

            <label
                htmlFor="file-upload"
                {...dragEvents}
                className={cx(classes.root, isDragOver && classes.onDragOver)}
            >
                <Box
                    width={width}
                    height={height}
                    bgcolor={backgroundColor}
                    className={classes.noMouseEvent}
                >
                    {(!imageButton || isDragOver || isMouseOver) && (
                        <Box
                            height={height}
                            width={width}
                            className={classes.iconText}
                        >
                            <CloudUpload fontSize="large"/>
                            <Typography>{labelText}</Typography>
                        </Box>
                    )}
                </Box>
            </label>
        </>
    )
}
