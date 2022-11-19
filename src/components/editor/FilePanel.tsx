import {useEditorViewerContext} from "./EditorViewerContext";
import styles from "./mozilla-pdfjs-based/PdfjsViewer.module.scss";
import React from "react";
import {TextInput, Form } from "../forms";



export default function FilePanel({ fileId }: { fileId: number | string }) {
    const { sourcePanelOpen } = useEditorViewerContext();

    return sourcePanelOpen ? (
        <div className={styles.SourcePanel}>
            <Form
                endpoint={`files/${fileId}`}
                isNew={false}
            >
                <h6>Edit source information</h6>

                <TextInput.Formik name="" />
            </Form>
        </div>
    ) : null;
}
