import React, {Fragment} from 'react';
import Page from "../components/layout/page/Page";
import styles from './Home.module.scss';
import Container from "@mui/material/Container";
import { Row, Col } from 'react-grid-system';
import {relationOptions, RelationValue} from "../utils/enums";


function BrowserPluginSvg() {
    return (
        <svg viewBox="-5 -5 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="myGradient" gradientTransform="rotate(90)">
                    <stop offset="5%" stop-color="rgb(4 120 87)" />
                    <stop offset="95%" stop-color="rgb(16 185 129)" />
                </linearGradient>
            </defs>
            <rect width={500} height={60} x="-50" y={45} fill="rgba(255, 255, 255, 1)"  />
            <rect width={300} height={40} x="-50" y={55} fill="#ccc"  rx={15} ry={15} />
            <rect width={500} height={500} x="-50" y={0} stroke="#fff" strokeWidth="3" rx="20" ry="20" />

            <circle r={20} cx={280} cy={75} fill="url('#myGradient')" />
            <text x={274} y={83} fill="#fff" fontSize={24} fontWeight="bold">P</text>
            <text x={-120} y={83} fill="#fff" fontSize={24} fontWeight="bold">http://domain.com/example.pdf</text>

            <circle r={4} cx={425} cy={65} fill="#ccc" />
            <circle r={4} cx={425} cy={75} fill="#ccc" />
            <circle r={4} cx={425} cy={85} fill="#ccc" />
        </svg>
    )
}

function ConnectSvg() {
    const paper = {
        padding: {
            x: 20,
            y: 80,
        },
        x: 150,
        y: 100,
        lineHeight: 8,
        lineWidth: [60, 80],
        width: 189,
        lineColors: [
            [relationOptions[RelationValue.Support].color, '#ccc'],
            ['#ccc', '#ccc'],
            ['#ccc', relationOptions[RelationValue.Disproves].color],
            ['#ccc', '#ccc'],
            ['#ccc', relationOptions[RelationValue.FollowsUp].color],
            ['#ccc', '#ccc'],
            ['#ccc', '#ccc'],
            [relationOptions[RelationValue.Disproves].color, '#ccc'],
            ['#ccc', '#ccc'],
        ]
    }
    return (
        <svg viewBox="-5 -5 510 510" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1={paper.x} y1={185} x2={80} y2={90} stroke={paper.lineColors[0][0]} strokeWidth="5" />
            <circle cx={50} cy={50} r="50" stroke="#fff" strokeWidth="3"  />
            <text x={25} y={55} fill="#fff" fontSize={24} fontWeight="bold">PDF</text>
            <text x={30} y={170} fontSize={20} fill={paper.lineColors[0][0]} fontWeight="bold">Supports</text>

            <line x1={340} y1={227} x2={410} y2={130} stroke={paper.lineColors[2][1]} strokeWidth="5" />
            <circle cx={445} cy={100} r="50" stroke="#fff" strokeWidth="3"  />
            <text x={415} y={105} fill="#fff" fontSize={24} fontWeight="bold">PPTX</text>
            <text x={390} y={190} fontSize={20} fill={paper.lineColors[2][1]} fontWeight="bold">Disproves</text>

            <line x1={340} y1={260} x2={410} y2={320} stroke={paper.lineColors[4][1]} strokeWidth="5" />
            <circle cx={450} cy={350} r="50" stroke="#fff" strokeWidth="3"  />
            <text x={425} y={355} fill="#fff" fontSize={24} fontWeight="bold">JPG</text>
            <text x={380} y={280} fontSize={20} fill={paper.lineColors[4][1]} fontWeight="bold">Follow up</text>

            <line x1={paper.x} y1={320} x2={110} y2={400} stroke={paper.lineColors[7][0]} strokeWidth="5" />
            <circle cx={75} cy={440} r="50" stroke="#fff" strokeWidth="3"  />
            <text x={40} y={445} fill="#fff" fontSize={24} fontWeight="bold">DOCX</text>
            <text x={15} y={350} fontSize={20} fill={paper.lineColors[7][0]} fontWeight="bold">Contradicts</text>

            <rect width={189} height={270} x={paper.x} y={paper.y} stroke="#fff" strokeWidth="3" rx="20" ry="20" />
            <text x={paper.x + paper.width * 0.30} y={paper.y + 50} fill="#fff" fontSize={36} fontWeight="bold">PDF</text>

            {[...new Array(9)].map((v, idx) => {
                const inverse = idx % 2 === 0;
                return (
                    <Fragment key={idx}>
                        <rect
                            width={paper.lineWidth[inverse ? 0: 1]}
                            height={paper.lineHeight}
                            x={paper.x + paper.padding.x}
                            y={paper.y + paper.padding.y + idx * paper.lineHeight * 2.5}
                            fill={paper.lineColors[idx][0]}
                        />
                        <rect
                            width={paper.lineWidth[inverse ? 1: 0]}
                            height={paper.lineHeight}
                            x={paper.x + paper.padding.x + paper.lineWidth[inverse ? 0: 1] + 10}
                            y={paper.y + paper.padding.y + idx * paper.lineHeight * 2.5}
                            fill={paper.lineColors[idx][1]}
                        />
                    </Fragment>
                )
            })}
        </svg>
    );
}

function Home() {
    return (
        <Page inContainer={false}>
            <section className={styles.Fold}>
                <h1><span>PAPER</span>TRAILER</h1>
                <p>Finally, your research organised.</p>
            </section>
            <section className={styles.SecondSection}>
                <Container maxWidth="md">
                    <Row>
                        <Col>
                            <h2>Connect sources</h2>
                            <p>
                                Connect two snippets of texts in different files with a relation.
                            </p>
                            {/*<p>*/}
                            {/*    E.g. <b>A contradicts B, A is better explained in B, A supports B, etc.</b>*/}
                            {/*</p>*/}
                        </Col>
                        <Col md={5}>
                            <ConnectSvg />
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className={styles.SecondSection}>
                <Container maxWidth="md">
                    <Row>
                        <Col md={5}>
                            <BrowserPluginSvg />
                        </Col>
                        <Col>
                            <h2>Upload easily via browser extension</h2>
                            <p>
                                Download our Chrome plugin to import any file you come across while searching
                                the web.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className={styles.SecondSection}>
                <Container maxWidth="lg">
                    <Row>
                        <Col>
                            <h2>Streamlining features.</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h3>Work together</h3>
                            <p>
                                Easily share your files and your findings with <b>other users, organisations</b> or the <b>public</b>!
                            </p>
                        </Col>
                        <Col>
                            <h3>Custom Labels</h3>
                            <p>Because labels are simply better than folders. With unique labels sets for
                                you individually, and for your organisation.</p>
                        </Col>
                        <Col>
                            <h3>Advanced Searching</h3>
                            <p>
                                Use the search bar to find your files by <b>name</b>, the <b>content</b> of
                                your files or the <b>relation</b> between files.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className={styles.FourthSection}>
                <Container>
                    <Row>
                        <Col>
                            <h2>For academics.</h2>
                            <p>
                                Finally bring order to that pile of papers with labels and relations.
                                And share your insights and readings with fellow researchers.
                            </p>
                        </Col>
                        <Col>
                            <h2>For journalists.</h2>
                            <p></p>
                        </Col>
                        <Col>
                            <h2>For advisors.</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>For historians.</h2>
                            <p>Use timelines to put your sources on </p>
                        </Col>
                        <Col>
                            <h2>For teachers</h2>
                            <p>Share a single document with all your students and do research together.</p>
                        </Col>
                        <Col>

                        </Col>
                    </Row>
                </Container>
            </section>
            <section className={styles.ThirdSection}>
                <h2>Free for individuals.</h2>
            </section>
        </Page>
    );
}

export default Home;
