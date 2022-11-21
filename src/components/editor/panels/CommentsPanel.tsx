import {useEditorViewerContext} from "../EditorViewerContext";
import styles from "./CommentsPanel.module.scss";
import React from "react";
import SidePanel from "../../layout/SidePanel";
import CommentSection from "../../comments/CommentSection";
import Header from "../../texts/Header";


export default function CommentsPanel({ fileId }: { fileId: number | string }) {
    const { commentSectionOpen } = useEditorViewerContext();

    return commentSectionOpen ? (
        <SidePanel className={styles.CommentsPanel}>
            <Header
                text="General comments"
            />
            <CommentSection type="file" id={Number(fileId)} />
        </SidePanel>
    ) : null;
}
