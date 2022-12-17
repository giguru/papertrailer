import React, {useEffect} from 'react';
import {useNavigate} from "react-router";
import {Pages} from "../components/layout";
import Description from "../components/Description";
import {useParams} from "react-router-dom";
import {routes} from "../utils";
import BackendForm from "../components/forms/BackendForm";
import SignUpFields, {signUpInitialValues} from "./partials/SignUpFields";
import {concepts} from "../libs/lang";
import {backendEndpoints} from "../libs/backendEndpoints";
import useAuth from "../components/hooks/useAuth";
import useTitle from "../components/hooks/useTitle";

export default function CompleteAccount() {
    useTitle('Complete your account')
    const navigate = useNavigate()
    const { userId, hash } = useParams()
    const { user, saveToken } = useAuth()

    useEffect(() => {
        // Log out the currently logged in account if the user wants to complete an(other) account.
        if (user) {
            saveToken(undefined);
            window.location.reload();
        }
    }, [user])

    return (
        <Pages.Centred width="xs" padded>
            <h1 className="gradient-color mb-5">Complete your account.</h1>
            <Description className="mb-5">
                We're happy to see you join your {concepts.Group}. Please fill in the details below to complete your
                account.
            </Description>
            <BackendForm
                initialValues={{
                    hash,
                    user_id: userId,
                    ...signUpInitialValues.Account,
                    ...signUpInitialValues.UsernamePassword,
                }}
                onSuccess={() => navigate(routes.completeAccountSuccess)}
                targetEndpoint={backendEndpoints.signUp}
                targetMethod="PUT"
            >
                <h3>Create login.</h3>
                <SignUpFields.UsernamePassword />
                <br/>
                <SignUpFields.Account />
            </BackendForm>
        </Pages.Centred>
    );
}
