import React from 'react';
import {CommentType, useComments} from "../../api/hooks/comments";
import Comment from './Comment';
import {Form, TextInput} from "../forms";
import {SaveButton} from "../forms/Form";
import styles from './CommentSection.module.scss';
import NoResults from "../NoResults";
import Loader from "../loader/Loader";

interface CommentProps {
    type: CommentType
    id: number
}

function CommentSection({ type, id }: CommentProps) {
    const { comments, refetch, isLoading } = useComments(type, id);

    return (
        <div className={styles.CommentSection}>
            <ul className={styles.CommentList}>
                {isLoading && <Loader />}
                {comments?.length
                    ? comments?.map((comment) => <Comment {...comment} key={comment.id} />)
                    : <NoResults>Be the first to place a comment!</NoResults>}
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
                <TextInput.Formik name="text" placeholder="What do you know?" multiline />
                <div className={styles.ButtonFooter}>
                    <SaveButton text="Add comment" />
                </div>
            </Form>
        </div>
    );
}

export default CommentSection;
