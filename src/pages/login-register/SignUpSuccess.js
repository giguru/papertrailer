import React from 'react';
import {Pages} from "../components/layout";
import useTitle from "../components/hooks/useTitle";

export default function SignUpSuccess() {
    useTitle('Welcome to the Fearless League')

    return (
        <Pages.Centred width="xs" className="text-center">
            <h1 className="gradient-color mb-3">Almost done!</h1>
            <p>Please verify your email to complete your signup.</p>
        </Pages.Centred>
    );
}
