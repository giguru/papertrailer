import React from 'react';
import {Col, Container, Row} from "react-grid-system";
import styles from './AppFooter.module.scss';

function AppFooter() {
    return (
        <footer className={styles.AppFooter}>
            <Container>
                <Row>
                    <Col>
                        <h3>Papertrailer</h3>
                        <p>A product for the curious, by the curious.</p>
                    </Col>
                    <Col>

                    </Col>
                    <Col>

                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default AppFooter;
