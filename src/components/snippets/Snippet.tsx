import React, { CSSProperties } from 'react';
import styles from './Snippet.module.scss'
import {routes} from "../../utils/routes";
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

const DIV = ' ';
const N = 4

interface SnippetProps {
    className?: string,
    onClick?: () => void,
    text?: string,
    style?: CSSProperties,
    fileId?: number
    navigation?: 'newTab'
}

function Snippet({ text, className, style, onClick, navigation = 'newTab', fileId }: SnippetProps) {
    const words = text?.split(DIV) || []
    return (
        <div
            className={`${styles.Snippet} ${className}`}
            style={style}
            onClick={onClick}
        >
            <div className={styles.TextContainer}>
                <span className={styles.Text}>
                    {words.length > N * 2 ? `${words.slice(0, N).join(DIV)} ... ${words.slice(-N).join(DIV)}` : words.join(DIV)}
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
