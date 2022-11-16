import React from 'react';
import Select from "../forms/Select";
import {relationOptions} from "../../utils/enums";
import Button from "../button/Button";
import Form from "../forms/Form";
import styles from './RelationPopUp.module.scss';
import {AnySelection} from "./EditorViewer.utils";

interface RelationPopUpProps {
    selectionA: AnySelection,
    selectionB: AnySelection,
    initialFormData: Record<string, any>,
    onSuccess?: () => void,
}

function RelationPopUp({
    selectionA,
    selectionB,
    initialFormData,
    onSuccess,
}: RelationPopUpProps) {
    return (
        <Form
            endpoint="relations"
            initialFormData={initialFormData}
            onSuccess={onSuccess}
            isNew
        >
            <p className={styles.TextBox}>{selectionA.text}</p>

            <Select.Formik
                name="relation"
                label="Relation"
                options={Object.values(relationOptions)}
            />
            <p className={styles.TextBox}>{selectionB.text}</p>
            <Button type="submit">Save</Button>
        </Form>
    );
}

export default RelationPopUp;
