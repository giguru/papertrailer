import React from "react";
import Page from "../components/layout/page/Page";
import {AllInclusive, Check} from "@mui/icons-material";

import styles from './Pricing.module.scss';


export default function Pricing() {
    return (
        <Page inContainer>
            <h1>Pricing</h1>

            <table className={styles.PricingTable}>
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>
                            <h3>Free spirit</h3>

                            <div className="colorPrimary">FREE</div>
                        </th>
                        <th>
                            <h3>Professional</h3>
                            &euro;
                            10 / month
                        </th>
                        <th>
                            <h3>Organisation</h3>
                            &euro;
                            7 / user / month
                        </th>
                        <th>
                            <h3>Enterprise</h3>
                            &euro;
                            15 / user / month
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={5}>Sharing & visibility</td>
                    </tr>
                    <tr>
                        <td>Can share with</td>
                        <td>Max. 2 people</td>
                        <td><AllInclusive /></td>
                        <td><AllInclusive /></td>
                        <td><AllInclusive /></td>
                    </tr>
                    <tr>
                        <td>Private files</td>
                        <td>500</td>
                        <td><AllInclusive /></td>
                        <td><AllInclusive /></td>
                        <td><AllInclusive /></td>
                    </tr>
                    <tr>
                        <td>Public files</td>
                        <td>100</td>
                        <td><AllInclusive /></td>
                        <td><AllInclusive /></td>
                        <td><AllInclusive /></td>
                    </tr>
                    <tr>
                        <td colSpan={5}>Extras</td>
                    </tr>
                    <tr>
                        <td>Browser extensions</td>
                        <td><Check /></td>
                        <td><Check /></td>
                        <td><Check /></td>
                        <td><Check /></td>
                    </tr>
                    <tr>
                        <td colSpan={5}>Security</td>
                    </tr>
                    <tr>
                        <td>Two-factor authentication</td>
                        <td><Check /></td>
                        <td><Check /></td>
                        <td><Check /></td>
                        <td><Check /></td>
                    </tr>
                    <tr>
                        <td>SSO</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><Check /></td>
                    </tr>
                    <tr>
                        <td>File ownership</td>
                        <td>User</td>
                        <td>User</td>
                        <td>Organisation</td>
                        <td>Organisation</td>
                    </tr>
                </tbody>
            </table>
        </Page>
    )
}
