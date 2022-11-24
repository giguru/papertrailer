import React, { CSSProperties } from 'react';
import styles from './Snippet.module.scss'
import {routes} from "../../utils/routes";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import TextSummary, {splitWords} from "../texts/TextSummary";

interface SnippetProps {
    className?: string,
    onClick?: () => void,
    text?: string,
    style?: CSSProperties,
    fileId?: number
    navigation?: 'newTab'
}

function Snippet({ text, className, style, onClick, navigation = 'newTab', fileId }: SnippetProps) {
    const words = splitWords(text)
    return (
        <div
            className={`${styles.Snippet} ${className}`}
            style={style}
            onClick={onClick}
        >
            <div className={styles.TextContainer}>
                <span className={styles.Text}>
                    <TextSummary text={text} />
                </span>
                <span>{words.length} words</span>
            </div>

            {navigation && fileId && <a target="_blank" className={styles.Link} href={routes.editFile(fileId)} title="Open in New Tab">
                <OpenInNewOutlinedIcon fontSize="small" />
            </a>}
        </div>
    );
}

export default Snippet;
