import React from 'react';
import {Form, TextInput} from "../components/forms";
import {SaveButton} from "../components/forms/Form";
import Page from "../components/layout/page/Page";
import {useNavigate} from "react-router";
import {routes} from "../utils/routes";
import {useAuth} from "../components/auth-provider/AuthProvider";

function LoginPage() {
    const auth = useAuth();
    const navigate = useNavigate();
    const initialData = {
        email_or_username: '',
        password: '',
        token_name: 'website',
    };

    return (
        <Page inContainer>
            <Form<typeof initialData, { token: string }>
                initialFormData={initialData}
                endpoint="create-token"
                onSuccess={({ data }) => {

                    if (data?.token) {
                        auth.storeLogin(data.token);
                    }
                    navigate(routes.mySources);
                }}
                isNew
            >
                <h1>Log in</h1>
                <TextInput.Formik name="email_or_username" label="Email" />
                <TextInput.Formik name="password" type="password" label="Password" />
                <SaveButton text="Log in" />
            </Form>
        </Page>
    );
}

export default LoginPage;
