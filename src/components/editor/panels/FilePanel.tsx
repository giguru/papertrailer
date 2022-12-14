import {useEditorViewerContext} from "../EditorViewerContext";
import styles from "../mozilla-pdfjs-based/PdfjsViewer.module.scss";
import React from "react";
import {TextInput, Form } from "../../forms";
import SidePanel from "../../layout/SidePanel";
import {SaveButton} from "../../forms/Form";
import {useFormikContext} from "formik";
import moment from "moment";
import {ApiFileInterface} from "../../../api/models";
import DataRow from "../../forms/DataRow";
import RelationsPerCategory from "../RelationsPerCategory";
import Box from "@mui/material/Box";
import DeleteButton from "../../forms/DeleteButton";
import {useNavigate} from "react-router";
import {routes} from "../../../utils/routes";
import ItemPicker from "../../forms/ItemPicker";
import {useLabels} from "../../../api/hooks/labels";

function InnerForm() {
    const { labels } = useLabels({ });
    const { relations } = useEditorViewerContext();
    const { values: file } = useFormikContext<ApiFileInterface>();
    const navigate = useNavigate();
    const afterDelete = () => navigate(routes.myFiles);

    return (
        <>
            <TextInput.Formik name="title" label="Title" />
            <TextInput.Formik name="description" label="Description" multiline />
            <TextInput.Formik name="origin_url" label="Origin URL" />
            <ItemPicker.Formik label="Labels" name="labels" options={labels?.map((label ) => (
                { value: `${label.id}`, label: label.name, color: label.color }
            )) || []} />
            <Box style={{ justifyContent: 'space-between', display: 'flex' }}>
                <DeleteButton endpoint={`/files/${file.id}`} onSuccess={afterDelete} />
                <SaveButton />
            </Box>

            <br />
            <br />
            <hr />
            <br />
            {Array.isArray(relations) && (
                <DataRow label="Number of relations">
                    {relations?.length} in total.
                    <br/>
                    <RelationsPerCategory relations={relations} />
                </DataRow>
            )}
            <DataRow label="Created at">{moment(file.created_at).format('DD MMM YYYY HH:mm')}</DataRow>
            <DataRow label="Created at">{moment(file.created_at).format('DD MMM YYYY HH:mm')}</DataRow>
        </>
    )
}


export default function FilePanel({ fileId }: { fileId: number | string }) {
    const { sourcePanelOpen } = useEditorViewerContext();

    return sourcePanelOpen ? (
        <SidePanel className={styles.SourcePanel}>
            <Form
                endpoint={`files/${fileId}?_with[]=labels`}
                isNew={false}
            >
                <h2>Edit source information</h2>

                <InnerForm />
            </Form>
        </SidePanel>
    ) : null;
}
