import React, {useEffect, useMemo, useState} from 'react';
import {PDFDocumentLoadingTask, PDFPageProxy} from "pdfjs-dist";
import {PDFDocumentProxy} from "pdfjs-dist/types/src/display/api";
import PageContainer from "../shared/PageContainer";
import PdfJsPage from "./PdfJsPage";
import {useSourceRelations} from "../../../api/hooks/relations";
import {ApiFileInterface, ApiRelationInterface} from "../../../api/models";
import RelationsPageInterface from "../shared/RelationsInterface";

// We import this here so that it's only loaded during client-side rendering.

const examplePdfs: Record<number, string> = {
    1: '/attention-is-all-you-need.pdf',
    2: '/reproducibility-is-a-process.pdf',
};

/**
 * Render a PDF and all its pages.
 *
 * @param file
 * @constructor
 */
function PdfjsViewer({ file, PageChildComponent }: { file: ApiFileInterface, PageChildComponent?: React.FunctionComponent<{ pageIndex: number }> }) {
    const fileId = file.id;
    const { relations } = useSourceRelations(fileId)
    const [pdf, setPdf] = useState<PDFDocumentProxy | undefined>()
    const [pages, setPages] = useState<PDFPageProxy[]>([]);

    useEffect(() => {
        (async function () {
            // We import this here so that it's only loaded during client-side rendering.
            // @ts-ignore
            const pdfJS = await import('pdfjs-dist/build/pdf');
            pdfJS.GlobalWorkerOptions.workerSrc =
                window.location.origin + '/pdf.worker.min.js';
            const loadingTask : PDFDocumentLoadingTask = pdfJS.getDocument(examplePdfs[fileId] || examplePdfs["1"])
            setPdf(await loadingTask.promise);
        })()
    }, []);

    useEffect(() => {
        if (pdf?.numPages) {
            const promises = [...new Array(pdf.numPages)].map((_, pageIndexNumber) => pdf.getPage(pageIndexNumber + 1))
            Promise.all(promises)
                .then(pages => setPages(pages))
                .catch(console.error);
        } else {
            setPages([]);
        }
    }, [pdf])

    const relationsPerPageIndex = useMemo(() => {
        const perIndex : Record<number, Record<number, ApiRelationInterface>> = {}
        if (pages && relations) {
            relations?.forEach((r) => {
                r.file_bounding_blocks?.forEach((fbb) => {
                    if (!perIndex[fbb.page_index]) {
                        perIndex[fbb.page_index] = {}
                    }
                    perIndex[fbb.page_index][r.id] = r
                })
            })
        }
        return perIndex
    }, [relations, pages])

    return (
        <>
            {pages.map((page, pageIndexNumber) => (
                <PageContainer key={pageIndexNumber}>
                    <PdfJsPage
                        page={page}
                        pageIndex={pageIndexNumber}
                        fileId={fileId}
                    />
                    {relationsPerPageIndex[pageIndexNumber] && (
                        <RelationsPageInterface
                            relations={Object.values(relationsPerPageIndex[pageIndexNumber])}
                        />
                    )}
                    {PageChildComponent && <PageChildComponent pageIndex={pageIndexNumber} />}
                </PageContainer>
            ))}
        </>
    );
}

export default PdfjsViewer;

