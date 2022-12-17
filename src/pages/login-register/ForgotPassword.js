import React, {useState} from 'react';
import {Pages} from "../components/layout";
import BackendForm from "../components/forms/BackendForm";
import FloatingLabelField from "../components/forms/FloatingLabelField";
import Description from "../components/Description";
import Alert from "react-bootstrap/Alert";
import {backendEndpoints} from "../libs/backendEndpoints";
import useTitle from "../components/hooks/useTitle";

export default function ForgotPassword() {
    useTitle('Password forgotten')
    const [success, setSuccess] = useState()

    return (
        <Pages.Centred width="xs" padded>
            <h1 className="mb-5">Reset password.</h1>
            <Description className="mb-5">
                Enter your email address below and you'll be back in no time!
            </Description>
            {success
                ? (
                    <Alert className="alert-info">
                        You will receive an email with a password reset link within a few minutes.
                    </Alert>
                )
                : (
                    <BackendForm
                        targetMethod="POST"
                        onSuccess={() => setSuccess(true)}
                        targetEndpoint={backendEndpoints.forgotPassword}
                        initialValues={{
                            email: '',
                            password: '',
                            password_copy: '',
                            first_name: '',
                            last_name: '',
                        }}
                    >
                        <FloatingLabelField name="email" label="Enter your email address" autoFocus />
                    </BackendForm>
                )}

        </Pages.Centred>
    );
}
