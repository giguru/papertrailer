import React from 'react';
import {Pages} from "../components/layout";
import {Link} from "react-router-dom";
import {routes} from "../utils";
import useTitle from "../components/hooks/useTitle";


// This page is used after sign up, but also after verify a new email when replacing the current.
export default function EmailVerified() {
    useTitle('Email verified')

    return (
        <Pages.Centred width="xs">
            <h1>Email verified.</h1>
            <p>You can now <Link to={routes.login}>log in</Link>.</p>
        </Pages.Centred>
    );
}
