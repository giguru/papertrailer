import React, { useEffect } from 'react';
import {Pages} from "../components/layout";
import {BackendForm, FloatingLabelField} from "../components/forms";
import {routes} from "../utils";
import {useSearchParams} from "react-router-dom";

function deleteCookie( name, path = '/', domain = window.location.hostname ) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

export default function TwoFactorChallenge() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Need to be deleted, because otherwise Sanctum Guard will try to set the request's user
        // which will create the request user token using TransientToken, but we need it to use the
        // App\Model\PersonalAccessToken. See Laravel\Sanctum\Guard::__invoke method.
        deleteCookie('XSRF-TOKEN');
        deleteCookie('fearless_league_session');
    }, []);

    return (
        <Pages.Centred width="xs">
            <BackendForm
                targetMethod="POST"
                targetEndpoint="/two-factor-challenge-custom"
                onSuccess={({ data }) => {
                    // Hard refresh such that some global state (regarding auth cookies) is correctly initialised.
                    window.location.href = searchParams.get('redirect') || routes.landing;
                }}
                initialValues={{
                    code: '',
                }}
                onError={({ data, status }) => {
                    // If the user takes too long, the token expires and the user must be redirected to login again
                    if (status === 401) {
                        window.location.href = routes.login;
                    }
                }}
                showFooter={false}
            >
                <h2>Confirm access</h2>
                <p>
                    Open the two-factor authenticator (TOTP) app on your mobile device to view your <b>authentication code</b>.
                    You can also use one of your <b>recovery codes</b>.
                </p>
                <FloatingLabelField name="code" label="Authentication code" />
                <BackendForm.Footer showError />
            </BackendForm>
        </Pages.Centred>
    );
}


TwoFactorChallenge.propTypes = {
};
TwoFactorChallenge.defaultProps = {

};
