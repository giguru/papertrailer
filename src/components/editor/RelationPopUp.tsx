import React from 'react';
import Select from "../forms/Select";
import {relationOptions, RelationValue} from "../../utils/enums";
import Button from "../button/Button";
import Form from "../forms/Form";
import styles from './RelationPopUp.module.scss';
import {AnySelection} from "./EditorViewer.utils";
import {useField} from "formik";
import Snippet from "../snippets/Snippet";
import {ApiFileBoundingBlockInterface} from "../../api/models";

interface RelationPopUpProps {
    relationId?: number,
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
                    style={{ top: directionValue === Direction.FORWARDS ? 0 : '75%' }}
                    text={selectionA.text}
                    fileId={selectionA.fileId}
                />
                <div className={styles.RelationInputsContainer}>
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
                    style={{ top: directionValue === Direction.FORWARDS ? 0: '-75%'}}
                    text={selectionB.text}
                    fileId={selectionB.fileId}
                />
            </div>

            <Button type="submit">Save</Button>
        </>
    )
}

export function selectionToFileBoundingBlock(selection: AnySelection): Omit<ApiFileBoundingBlockInterface, 'created_at' | 'updated_at' | 'index' | 'id'> {
    if ('boundingBlocks' in selection) {
        return { file_id: selection.fileId, ...selection.boundingBlocks[0], page_index: selection.pageIndex }
    }

    return {
        file_id: selection.fileId,
        height: selection.height,
        width: selection.width,
        x: selection.x,
        y: selection.y,
        page_index: selection.pageIndex,
        text: selection.text
    }
}

export function fileBoundingBlockToSelection(fileBoundingBlock: ApiFileBoundingBlockInterface): AnySelection {
    return {
        pageIndex: fileBoundingBlock.page_index,
        fileId: fileBoundingBlock.file_id,
        height: fileBoundingBlock.height,
        width: fileBoundingBlock.width,
        x: fileBoundingBlock.x,
        y: fileBoundingBlock.y,
        text: fileBoundingBlock.text,
        selected: true,
        boundingBlocks: [
            fileBoundingBlock
        ]
    }
}

function RelationPopUp({
    relationId,
    selectionA,
    selectionB,
    initialFormData,
    onSuccess,
}: RelationPopUpProps) {
    return (
        <Form
            endpoint={relationId ? `relations/${relationId}` : 'relations'}
            isNew={!relationId}
            initialFormData={{
                ...initialFormData,
                direction: Direction.FORWARDS,
                file_bounding_blocks: [
                    selectionToFileBoundingBlock(selectionA),
                    selectionToFileBoundingBlock(selectionB),
                ],
            }}
            onSuccess={onSuccess}
        >
            <InnerForm
                selectionA={selectionA}
                selectionB={selectionB}
            />
        </Form>
    );
}

export default RelationPopUp;
