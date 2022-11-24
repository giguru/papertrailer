import {
    ApiCommentsInterface,
    ApiFileBoundingBlockInterface,
    ApiFileInterface,
} from "../../../api/models";
import React, {Fragment, useMemo, useState} from "react";
import styles from './CommentsInterface.module.scss';
import {useEditorViewerContext} from "../EditorViewerContext";
import FloatingPane from "../../FloatingPane";
import CommentSection from "../../comments/CommentSection";
import ContentTypeIndicator from "./ContentTypeIndicator";
import TextSummary from "../../texts/TextSummary";
import Snippet from "../../snippets/Snippet";
import {Direction, fileBoundingBlockToSelection} from "../RelationPopUp";

const relevantForFile = (file: ApiFileInterface | undefined, fileId: number) => file && file.id === fileId
type ExtendedApiCommentInterface = ApiCommentsInterface & { indent: number }

const JUMP = 8
const MARGIN = 20;

/**
 * Display one relation in the editor including the indicator and edit / comment pane.
 *
 * @param relation
 */
function CommentDisplay({ comment }: { comment: ExtendedApiCommentInterface }) {
    const { file, scaler } = useEditorViewerContext()
    const [isOpen, setOpenComment] = useState(false)
    const open = () => setOpenComment(true)

    const color = '#666';
    const fileBoundingBlocks = comment.file_bounding_blocks || [];

    return (
        <Fragment>
            {fileBoundingBlocks.map((fbb) => {
                const { y, height, x, width, id, file_id: fileId } = fbb;
                if (!file || !relevantForFile(file, fileId)) return null;

                const selection = fileBoundingBlockToSelection(fbb);

                return (
                    <div
                        className={styles.Comment}
                        style={{ top: y * scaler }}
                        key={id}
                    >
                        <div
                            className={`${styles.Indicator} ${isOpen ? styles.OpenIndicator: ''}`}
                            style={{ height: height * scaler, backgroundColor: color, color, right: `${-MARGIN - comment.indent * JUMP}px` }}
                            onClick={open}
                        >
                            <span className={styles.Preview}>
                                <TextSummary text={comment.text} />
                                {comment.comments_count && <span>+ {comment.comments_count} reactions</span>}
                            </span>
                        </div>
                        <div
                            className={styles.ContentIndicator}
                            style={{
                                left: x * scaler - MARGIN,
                                width: width * scaler,
                                height: height * scaler,
                                backgroundColor: color
                            }}
                            onClick={open}
                        />
                        {isOpen && (
                            <FloatingPane
                                onClose={() => setOpenComment(false)}
                                position={{ top: 30, left: `calc(100% + ${(comment.indent + 1) * JUMP + MARGIN}px)` }}
                                className={styles.ContentModal}
                            >
                                <FloatingPane.Content>
                                    <Snippet
                                        text={selection.text}
                                        fileId={selection.fileId}
                                    />
                                </FloatingPane.Content>
                                <FloatingPane.Footer>
                                    <CommentSection.Thread id={comment.id} />
                                </FloatingPane.Footer>
                            </FloatingPane>
                        )}
                    </div>
                );
            })}
        </Fragment>
    )
}

/**
 * Display existing relations in the editor, so users can modify/comment/etc.
 *
 * @param relations Relevant relations for a page.
 * @constructor
 */
export default function CommentsPageInterface({ comments }: { comments: ApiCommentsInterface[] }) {
    const { file } = useEditorViewerContext()

    const sortedComments = useMemo(() => {
            let inWindow: Array<ApiCommentsInterface & { top: number, height: number }> = [];

            // TODO move indentation to file bounding block instead of relation. Case: when file is relating to itself.
            const sorted = comments
                .map((r) => {
                    const fbbs = r.file_bounding_blocks?.filter((fbb) => relevantForFile(file, fbb.file_id)) || [];
                    let minFbb: ApiFileBoundingBlockInterface = fbbs[0];
                    fbbs.forEach((fbb) => {
                        if (fbb.y < minFbb.y) minFbb = fbb
                    })
                    return {
                        ...r,
                        top: minFbb.y,
                        height: minFbb.height,
                    }
                })
                .sort((a, b) => {
                    if (a.top === b.top) return 0;
                    return a.top > b.top ? 1 : 1;
                });

            return sorted.map<ExtendedApiCommentInterface>((r) => {
                // Remove all in window
                inWindow = inWindow.filter((windowR) =>  r.top <= windowR.top + windowR.height)

                // Add current
                inWindow.push(r);

                return {...r, indent: inWindow.length - 1}
            })
        },
        [file, comments],
    );

    return (
        <>
            <ContentTypeIndicator position="right">Comments</ContentTypeIndicator>
            {sortedComments.map(comment => <CommentDisplay comment={comment} key={comment.id} />)}
        </>
    )
}
