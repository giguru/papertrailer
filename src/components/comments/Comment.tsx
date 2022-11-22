import React from 'react';
import {ApiCommentsInterface} from "../../api/models";
import DateSpan from "../texts/DateSpan";
import styles from './Comment.module.scss';
import UserNameSpan from "../texts/UserNameSpan";
import EmotionBar, {Variant} from "../emotions/EmotionBar";
import {EmotionValue} from "../../utils/enums";

function Comment({ text, created_at, created_by, id }: ApiCommentsInterface) {
    return (
        <li className={styles.Comment}>
            <div className={styles.Text}>
                <span className={styles.Header}>
                    {created_by && <UserNameSpan user={created_by} />}
                    <DateSpan date={created_at} />
                </span>
                {text.split('\n').map((text, idx) => <p className={styles.Paragraph} key={idx}>{text}</p>)}
                <EmotionBar
                    emotions={[EmotionValue.LIKE, EmotionValue.DISLIKE, EmotionValue.FUNNY]}
                    type="comment"
                    id={id}
                    variant={Variant.FooterInline}
                    classNameNoCounts={styles.HoverShow}
                />
            </div>
        </li>
    );
}

export default Comment;
