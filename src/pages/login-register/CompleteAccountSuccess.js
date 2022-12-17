import React from 'react';
import {Pages} from "../components/layout";
import {routes} from "../utils";
import {Link} from "react-router-dom";
import {concepts} from "../libs/lang";

export default function CompleteAccountSuccess() {
    return (
        <Pages.Centred width="xs" className="text-center">
            <h1 className="gradient-color mb-3">Account completed.</h1>
            <p>
                You have just signed up for adventure with your {concepts.Group}.
                <br /> Start by logging in&nbsp;
                <Link to={routes.login}>here</Link>.
            </p>
        </Pages.Centred>
    );
}
