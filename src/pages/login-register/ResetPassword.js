import React, {useState} from 'react';
import {Pages} from "../components/layout";
import BackendForm from "../components/forms/BackendForm";
import FloatingLabelField from "../components/forms/FloatingLabelField";
import Description from "../components/Description";
import Alert from "react-bootstrap/Alert";
import {useSearchParams} from "react-router-dom";
import {routes} from "../utils";
import {Lock} from "react-bootstrap-icons";
import {ErrorMessage} from "formik";
import {backendEndpoints} from "../libs/backendEndpoints";
import useTitle from "../components/hooks/useTitle";
import useAuth from "../components/hooks/useAuth";

export default function ResetPassword() {
    const { logout } = useAuth();
    useTitle('Password reset')

    const [searchParams] = useSearchParams()
    const [success, setSuccess] = useState(false)

    return (
        <Pages.Centred width="xs" padded>
            <h1 className="mb-5 text-center">Fill in new password</h1>
            <Description className="mb-5">

            </Description>
            {success
                ? (
                    <div className="text-center">
                        <Alert className="alert-info">
                            Your password was reset!
                        </Alert>
                        <a href={routes.login}>Go to login page</a>
                    </div>
                )
                : (
                    <BackendForm
                        targetMethod="POST"
                        onSuccess={() => {
                            // Auto log out, so that the user must log in with his/her new password.
                            logout();
                            setSuccess(true);
                        }}
                        targetEndpoint={backendEndpoints.resetPassword}
                        initialValues={{
                            token: searchParams.get('token'),
                            email: searchParams.get('email'),
                            password: '',
                            password_confirmation: '',
                        }}
                    >
                        <FloatingLabelField
                            name="password"
                            icon={<Lock />}
                            label="Password"
                            type="password"
                            autoFocus
                        />
                        <FloatingLabelField
                            name="password_confirmation"
                            icon={<Lock />}
                            label="Confirm password"
                            type="password"
                        />
                        <ErrorMessage
                            name="email"
                            className="text-danger"
                            render={(value) => <Alert className="alert-danger">{value}</Alert>}
                        />
                    </BackendForm>
                )}
        </Pages.Centred>
    );
}
