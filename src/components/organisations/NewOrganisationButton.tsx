import React from 'react';
import ModalBox from "../layout/ModalBox";
import { TextInput } from '../forms';
import Form, {SaveButton} from "../forms/Form";


function NewOrganisationButton({ onSuccess }: { onSuccess: () => void }) {
    return (
        <ModalBox.ViaButton
            buttonText="New organisation"
            header="Create new Organisation"
            closeButtonText="Finish uploading"
            variant="outlined"
        >
            <Form
                initialFormData={{
                    name: '',
                }}
                endpoint="/organisations"
                isNew
                onSuccess={onSuccess}
            >
                <TextInput.Formik name="name" label="Organisation name" />
                <SaveButton text="Create new organisation" />
            </Form>
        </ModalBox.ViaButton>
    );
}

export default NewOrganisationButton;
