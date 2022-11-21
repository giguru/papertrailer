import React from 'react';
import {ApiCommentsInterface} from "../../api/models";
import DateSpan from "../texts/DateSpan";
import styles from './Comment.module.scss';
import UserNameSpan from "../texts/UserNameSpan";

function Comment({ text, created_at, created_by }: ApiCommentsInterface) {
    return (
        <li className={styles.Comment}>
            <div className={styles.Text}>
                <span className={styles.Header}>
                    {created_by && <UserNameSpan user={created_by} />}
                    <DateSpan date={created_at} />
                </span>
                {text}
            </div>
        </li>
    );
}

export default Comment;
