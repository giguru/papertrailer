import React from 'react';
import useGet from "../../components/hooks/useGet";
import {Pages} from "../../components/layout";
import Loading from "../../components/Loading";
import {Alert} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {routes} from "../../utils";
import {Link} from "react-router-dom";
import {concepts} from "../../libs/lang";

const TwoFactorAuthenticationPropTypes = {}

const TwoFactorAuthenticationDefaultProps = {}

export default function TwoFactorAuthenticationSuccess() {
    const { data: codes, error, isLoading } = useGet({ endpoint: '/user/two-factor-recovery-codes', dataKey: 'codes' });

    return (
        <Pages.Centred width="xs" className="text-center">
            <h2>Two factor authentication enabled!</h2>
            <p>Please save the security codes displayed below in a save way.</p>

            {isLoading && <Loading />}
            {error && <Alert variant="danger">{error}</Alert>}

            <table className="table d-inline table-light ">
            {Array.isArray(codes) && codes.map((code) => (
                <tr key={code}>
                    <td className="p-2">
                        <code>{code}</code>
                    </td>
                </tr>
            ))}
            </table>

            <br/>
            <br/>
            <Link to={routes.dashboard}>
                <Button>
                    Go to {concepts.UserDashboard}
                </Button>
            </Link>
        </Pages.Centred>
    );
}

TwoFactorAuthenticationSuccess.propTypes = TwoFactorAuthenticationPropTypes;
TwoFactorAuthenticationSuccess.defaultProps = TwoFactorAuthenticationDefaultProps;
