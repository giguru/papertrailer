import React, {useEffect} from 'react';
import {useField, useFormikContext} from "formik";
import ModalBox from '../../layout/ModalBox';
import RadioButtonsGroup from "../../forms/RadioButtonsGroup";
import {Form, Select} from "../../forms";
import {ApiFileInterface} from "../../../api/models";
import {useOrganisations} from "../../../api/hooks/organisations";
import {OptionInterface} from "../../forms/utils";
import {FormProps, SaveButton} from "../../forms/Form";
import Alert from "@mui/material/Alert";
import {Typography} from "@mui/material";

const names = {
    TARGET: 'target',
    USER_ID: 'user_id',
    ORGANISATION_ID: 'organisation_id',
};
const targetOptions: Record<string, OptionInterface> = {
    USER: { label: 'To a user', value: 'user' },
    ORGANISATION: { label: 'One of my organisations', value: 'organisation' },
}

function DisplayOptions({ file }: { file: ApiFileInterface }) {
    const [targetField] = useField(names.TARGET);
    const [,, { setValue: setUserId }] = useField(names.USER_ID);
    const [,, { setValue: setOrganisationId }] = useField(names.ORGANISATION_ID);

    const { organisations } = useOrganisations({ });

    useEffect(() => {
        // Clean the other value
        if (targetField.value === targetOptions.USER.value) {
            setOrganisationId('');
        } else if (targetField.value === targetOptions.ORGANISATION.value) {
            setUserId('');
        }
    }, [targetField.value]);

    if (targetField.value === targetOptions.USER.value) {
        return (
            <Select.Formik
                options={file.sharings?.map((sharing) => ({
                    value: `${sharing.user_id}`, label: `${sharing.user?.first_name} ${sharing.user?.last_name}`,
                })) || []}
                name="user_id"
                label="To whom?"
            />
        );
    }
    if (targetField.value === targetOptions.ORGANISATION.value) {
        return (
            <Select.Formik
                options={organisations?.map((organisation) => ({
                    value: `${organisation.id}`, label: organisation.name,
                })) || []}
                name="organisation_id"
                label="To which organisation?"
            />
        );
    }

    return null;
}

const initialFormData: Record<string, string> = {
    [names.TARGET]: '',
    [names.USER_ID]: '',
    [names.ORGANISATION_ID]: '',
};

function Footer() {
    const { values } = useFormikContext<typeof initialFormData>();

    return values[names.USER_ID] || values[names.ORGANISATION_ID] ? (
        <>
            <Alert color="error">
                Transfer is permanent.
                <br />
                It can be reversed by the new owner.
            </Alert>
            <SaveButton text="Transfer" />
        </>
    ) : null;
}

function TransferOwnershipModalBox({ file, onSuccess }: { file: ApiFileInterface, onSuccess: FormProps<ApiFileInterface>['onSuccess'] }) {
    return (
        <Form
            isNew={false}
            initialFormData={initialFormData}
            endpoint={`files/${file.id}`}
            onSuccess={onSuccess}
        >
            <ModalBox.ViaButton
                buttonText="transfer"
                size="small"
                header="Transfer ownership"
                variant="text"
                footer={(
                    <Footer />
                )}
            >
                <RadioButtonsGroup.Formik
                    options={[targetOptions.USER, targetOptions.ORGANISATION]}
                    inlineOptions
                    name={names.TARGET}
                    label="Who to transfer this file to?"
                />
                <div className="spacer-sm" />
                <div>
                    <DisplayOptions file={file} />
                </div>
            </ModalBox.ViaButton>
        </Form>
    );
}

export default TransferOwnershipModalBox;
