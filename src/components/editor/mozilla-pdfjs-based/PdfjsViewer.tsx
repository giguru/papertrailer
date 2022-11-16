import React, {useEffect, useRef, useState} from 'react';
import styles from './PdfjsViewer.module.scss';
import EditorViewerContainer from '../shared/EditorViewerContainer';
import {PDFDocumentLoadingTask, PDFPageProxy} from "pdfjs-dist";
import {PDFDocumentProxy} from "pdfjs-dist/types/src/display/api";
import PageContainer from "../shared/PageContainer";
import PdfJsPage from "./PdfJsPage";

// We import this here so that it's only loaded during client-side rendering.

const examplePdf = '/attention-is-all-you-need.pdf';

function PdfjsViewer() {

    const [pdf, setPdf] = useState<PDFDocumentProxy | undefined>()
    const [pages, setPages] = useState<PDFPageProxy[]>([]);

    useEffect(() => {
        (async function () {
            // We import this here so that it's only loaded during client-side rendering.
            // @ts-ignore
            const pdfJS = await import('pdfjs-dist/build/pdf');
            pdfJS.GlobalWorkerOptions.workerSrc =
                window.location.origin + '/pdf.worker.min.js';
            const loadingTask : PDFDocumentLoadingTask = pdfJS.getDocument(examplePdf)
            setPdf(await loadingTask.promise);
        })()
    }, []);

    useEffect(() => {

        if (pdf?.numPages) {
            const promises = [...new Array(pdf.numPages)].map((_, pageIndexNumber) => pdf.getPage(pageIndexNumber + 1))
            Promise.all(promises)
                .then(pages => setPages(pages));

        } else {
            setPages([]);
        }

    }, [pdf])

    return (
        <>
            {pages.map((page, pageIndexNumber) => (
                <PageContainer key={pageIndexNumber}>
                    <PdfJsPage page={page} />
                </PageContainer>
            ))}
        </>
    );
}

export default PdfjsViewer;
