import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import useGet from "../../components/hooks/useGet";
import {Pages} from "../../components/layout";
import Loading from "../../components/Loading";
import {Alert} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import BackendForm from "../../components/forms/BackendForm";
import FloatingLabelField from "../../components/forms/FloatingLabelField";
import Header from "../../components/Header";
import {useNavigate} from "react-router";
import {routes} from "../../utils";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const TwoFactorAuthenticationPropTypes = {}

const TwoFactorAuthenticationDefaultProps = {}

export default function TwoFactorAuthentication() {
    const { data: svg, error, reload, isLoading } = useGet({ endpoint: '/user/two-factor-qr-code', dataKey: 'svg' });

    return (
        <Pages.Centred width="xs">
            <h2>Two factor authentication</h2>
            <ol>
                <li>
                    Download and open any authenticator app. (e.g., Microsoft, Google Authenticator).
                </li>
                <li>Scan the QR code.</li>
                <li>Enter the code down below.</li>
            </ol>

            {isLoading && <Loading />}
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="my-5" />

            <Row className="align-items-center">
                <Col sm={4}>
                    {svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
                </Col>
                <Col sm={8}>
                    <Header component="h6">Please enter the code</Header>
                    <BackendForm
                        showFooter
                        initialValues={{ code: '' }}
                        targetMethod="POST"
                        targetEndpoint="/user/confirmed-two-factor-authentication"
                        onSuccess={() => {
                            // Hard refresh
                            window.location.href = routes.twoFactorAuthenticationSuccess;
                        }}
                    >
                        <FloatingLabelField name="code" label="Code from your authenticator app" />
                    </BackendForm>
                </Col>
            </Row>

        </Pages.Centred>
    );
}

TwoFactorAuthentication.propTypes = TwoFactorAuthenticationPropTypes;
TwoFactorAuthentication.defaultProps = TwoFactorAuthenticationDefaultProps;
