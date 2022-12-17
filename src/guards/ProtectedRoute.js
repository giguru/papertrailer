import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import useAuth from "../../components/hooks/useAuth";
import {routes} from "../../utils";
import {Pages} from "../../components/layout";
import Loading from "../../components/Loading";
import {useNavigate} from "react-router";

export default function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate(routes.login);
        }
    }, [user, isLoading])

    return user
        ? children
        : <Pages.Centred ><Loading /></Pages.Centred>;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
