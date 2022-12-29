import React from 'react';
import ModalBox from "../layout/ModalBox";
import {ApiLabelInterface} from "../../api/models";
import ItemPicker from "../forms/ItemPicker";
import {Form} from "../forms";
import {useLabels} from "../../api/hooks/labels";
import {FormProps, SaveButton} from "../forms/Form";
import styles from './EditLabelsModalbox.module.scss';


interface Props {
    initLabels?: ApiLabelInterface[]
    endpoint: string
    buttonClassName?: string
    onSuccess: FormProps<ApiLabelInterface>['onSuccess'],
}

function EditLabelsModalBox({ initLabels, endpoint, onSuccess, buttonClassName } : Props) {
    const { labels } = useLabels({ });

    return (
        <Form
            endpoint={endpoint}
            initialFormData={{
                labels: initLabels?.map((label) => `${label.id}`) || [],
            }}
            onSuccess={onSuccess}
            isNew={false}
        >
            <ModalBox.ViaButton
                buttonText="+ labels"
                header="Edit labels"
                size="small"
                variant="text"
                buttonClassName={buttonClassName}
                footer={(
                    <SaveButton />
                )}
            >
                <div className={styles.Content}>
                    <ItemPicker.Formik
                        label="Labels"
                        name="labels"
                        options={labels?.map((label ) => (
                            { value: `${label.id}`, label: label.name, color: label.color }
                        )) || []}
                        floating={false}
                    />
                </div>
            </ModalBox.ViaButton>
        </Form>
    );
}

export default EditLabelsModalBox;
