import React, {useEffect} from 'react';
import {Pages} from "../components/layout";
import BackendForm from "../components/forms/BackendForm";
import FloatingLabelField from "../components/forms/FloatingLabelField";
import {useNavigate} from "react-router";
import {routes} from "../utils";
import Description from "../components/Description";
import {At} from "react-bootstrap-icons";
import {Link} from "react-router-dom";
import SignUpFields, {signUpInitialValues} from "./partials/SignUpFields";
import {backendEndpoints} from "../libs/backendEndpoints";
import useAuth from "../components/hooks/useAuth";
import useTitle from "../components/hooks/useTitle";


export default function SignUp() {
    useTitle('Try it for free!')
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (user) navigate(routes.dashboard);
    }, [user])

    return (
        <Pages.Centred width="xs" padded>
            <h1 className="gradient-color mb-5">Try for free!</h1>
            <Description className="mb-5">
                Adventurously sign up and you can try <i>all</i> our features. <br/>
                Have an account? Sign in <Link to={routes.login}>here</Link>.
            </Description>
            <BackendForm
                targetMethod="POST"
                onSuccess={() => navigate(routes.signUpSuccess)}
                targetEndpoint={backendEndpoints.signUp}
                initialValues={{
                    email: '',
                    ...signUpInitialValues.Account,
                    ...signUpInitialValues.UsernamePassword,
                }}
            >
                <h3>Create login.</h3>
                <SignUpFields.UsernamePassword />
                <br/>
                <SignUpFields.Account showEmail />
            </BackendForm>
        </Pages.Centred>
    );
}
