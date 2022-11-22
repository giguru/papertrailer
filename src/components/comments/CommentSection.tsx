import React from 'react';
import {CommentType, useComments} from "../../api/hooks/comments";
import Comment from './Comment';
import {Form, TextInput} from "../forms";
import {SaveButton} from "../forms/Form";
import styles from './CommentSection.module.scss';
import NoResults from "../NoResults";
import Loader from "../loader/Loader";
import {useField} from "formik";

interface CommentProps {
    type: CommentType
    id: number
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
            <Form
                endpoint="comments"
                onSuccess={() => refetch()}
                initialFormData={{
                    text: '',
                    type,
                    type_id: id,
                }}
                isNew
            >
                <InnerForm />
            </Form>
        </div>
    );
}

export default CommentSection;
