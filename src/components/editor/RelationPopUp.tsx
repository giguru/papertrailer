import React from 'react';
import Select from "../forms/Select";
import {relationOptions} from "../../utils/enums";
import Button from "../button/Button";
import Form from "../forms/Form";
import styles from './RelationPopUp.module.scss';
import {AnySelection} from "./EditorViewer.utils";
import {useField} from "formik";
import Snippet from "../snippets/Snippet";

interface RelationPopUpProps {
    selectionA: AnySelection,
    selectionB: AnySelection,
    initialFormData: Record<string, any>,
    onSuccess?: () => void,
}

export enum Direction {
    FORWARDS = 1,
    REVERSE = -1,
}

const fieldNames = {
    direction: 'direction',
    relation: 'relation',
}

const parts = {
    start: '0%',
    end: '75%',
}

function InnerForm({ selectionA, selectionB }: { selectionA: AnySelection, selectionB: AnySelection }) {
    const [{ value: directionValue },,{ setValue: setDirection}] = useField(fieldNames.direction);
    const [{ value: relationValue }] = useField(fieldNames.relation);
    const options = Object.values(relationOptions)
    const selectedOption = options.find(o => o.value === relationValue)

    return (
        <>
            <div className={styles.RelationDefinitionContainer}>
                <Snippet
                    className={styles.TextBox}
                    style={{ top: directionValue === Direction.FORWARDS ? parts.start : parts.end }}
                    text={selectionA.text}
                />
                <div className={styles.RelationInputsContainer} style={{ top: '25%' }}>
                    <Select.Formik
                        name={fieldNames.relation}
                        label="Relation"
                        options={options}
                    />
                    {selectedOption?.directional && (
                        <Button onClick={() => setDirection(directionValue * -1)}>
                            &#8597;
                        </Button>
                    )}
                </div>
                <Snippet
                    className={styles.TextBox}
                    style={{ top: directionValue === Direction.FORWARDS ? parts.end: parts.start }}
                    text={selectionB.text}
                />
            </div>

            <Button type="submit">Save</Button>
        </>
    )
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
            <InnerForm selectionA={selectionA} selectionB={selectionB} />
        </Form>
    );
}

export default RelationPopUp;
