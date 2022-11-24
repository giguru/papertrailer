import React, {useRef} from 'react';
import {useComment, useComments} from "../../api/hooks/comments";
import Comment from './Comment';
import {Form, TextInput} from "../forms";
import {SaveButton} from "../forms/Form";
import styles from './CommentSection.module.scss';
import NoResults from "../NoResults";
import Loader from "../loader/Loader";
import {useField} from "formik";
import {CommentType} from "../../api/models";
import Alert from "@mui/material/Alert";

interface CommentProps {
    type: CommentType
    id: number | string
}

const MAX_COMMENT_LENGTH = 255;

const fieldNames = {
    TEXT: 'text',
}
function InnerForm() {
    const [{ value: text }] = useField(fieldNames.TEXT);

    return (
        <>
            <TextInput.Formik name={fieldNames.TEXT} placeholder="Share your knowledge here!" multiline />
            <div className={styles.ButtonFooter}>
                <span className={styles.CharCount}>{text?.length} / {MAX_COMMENT_LENGTH}</span>
                {text?.length > 0 && <SaveButton text="Add comment" />}
            </div>
        </>
    );
}

function CommentSection({ type, id }: CommentProps) {
    const { comments, refetch, isLoading } = useComments(type, id);

    return (
        <div className={styles.CommentSection}>
            <ul className={styles.CommentList}>
                {isLoading && <Loader />}
                {comments?.length
                    ? comments?.map((comment) => <Comment {...comment} key={comment.id} />)
                    : <NoResults>Be the first to react</NoResults>}
            </ul>
            <CommentSectionForm onSuccess={() => refetch()} type={type} id={id} />
        </div>
    );
}

function CommentThread({ id }: Pick<CommentProps, 'id'>) {
    const { comment, refetch, isLoading, error } = useComment(id, { _with: ['comments'] });

    if (isLoading) return <Loader />;

    return comment ? (
        <div className={styles.CommentSection}>
            <b className={styles.MiniHeader}>Original comment</b>
            <Comment {...comment} key={comment.id} />
            <br />
            <b className={styles.MiniHeader}>Reactions</b>
            <ul className={styles.CommentList}>
                {comment.comments?.length
                    ? comment.comments?.map((subComment) => <Comment {...subComment} key={subComment.id} />)
                    : <NoResults>Start a discussion.</NoResults>}
            </ul>
            {comment && (
                <CommentSectionForm onSuccess={() => refetch()} type="comment" id={id} />
            )}
        </div>
    ) : (typeof error === 'string' ? <Alert variant="outlined" color="error">{error}</Alert> : null);
}

function CommentSectionForm({ onSuccess, type, id, initialFormData }: CommentProps & { onSuccess: () => void, initialFormData?: Record<string, any> }) {
    return (
        <Form
            endpoint="comments"
            onSuccess={onSuccess}
            initialFormData={{
                text: '',
                // Props before can be overwritten.
                ...(initialFormData || {}),
                // Props below cannot be overwritten.
                type,
                type_id: id,
            }}
            isNew
        >
            <InnerForm />
        </Form>
    )
}

CommentSection.Form = CommentSectionForm
CommentSection.Thread = CommentThread

export default CommentSection;
