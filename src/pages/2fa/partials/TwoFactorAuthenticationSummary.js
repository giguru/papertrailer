import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import useAuth from "../../../components/hooks/useAuth";
import {useNavigate} from "react-router";
import axios from "axios";
import {routes} from "../../../utils";
import Button from "react-bootstrap/Button";
import {Alert} from "react-bootstrap";
import moment from "moment";
import {standardDateTimeFormat} from "../../../utils/momentHelpers";
import Loading from "../../../components/Loading";
import {confirmDelete} from "../../../utils/confirmDelete";
import PasswordConfirmationButton from "../../../components/PasswordConfirmationButton";

const TwoFactorAuthenticationSummaryPropTypes = {}

const TwoFactorAuthenticationSummaryDefaultProps = {}

export default function TwoFactorAuthenticationSummary() {
    const { user, reloadUser, isLoading: isLoadingUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState();

    const enable2fa = () => {
        setError('');
        axios.post('/user/two-factor-authentication', null)
            .then(({ data }) => {
                navigate(routes.twoFactorAuthentication)
            })
            .catch((e) => {
                setError(e.response.data?.message || e.response.message || 'Something went wrong...')
            })
    }
    const disable2fa = () => {
        setError('');
        axios.delete('/user/two-factor-authentication')
            .then(({ data }) => {
                reloadUser();
            })
            .catch((e) => {
                setError(e.response.data?.message || e.response.message || 'Something went wrong...')
            })
    }

    if (isLoadingUser) {
        return <Loading />
    }

    return !user.has_2fa_enabled
        ? (
            <>
                <PasswordConfirmationButton
                    buttonProps={{
                        variant: 'primary'
                    }}
                    onSuccess={enable2fa}
                    buttonText="Enable 2FA"
                />
                {error && <Alert variant="danger">{error}</Alert>}
            </>
        ) : (
            <>
                <p>
                    <strong className="text-success">Two Factor Authentication enabled.</strong>
                </p>
                <PasswordConfirmationButton
                    buttonProps={{
                        variant: 'danger'
                    }}
                    buttonText="Disable Two Factor Authentication"
                    onSuccess={disable2fa}
                />
                {error && <Alert variant="danger">{error}</Alert>}
            </>
        );
}

TwoFactorAuthenticationSummary.propTypes = TwoFactorAuthenticationSummaryPropTypes;
TwoFactorAuthenticationSummary.defaultProps = TwoFactorAuthenticationSummaryDefaultProps;
