import React, {useEffect, useMemo, useState} from 'react';
import {PDFDocumentLoadingTask, PDFPageProxy} from "pdfjs-dist";
import {PDFDocumentProxy} from "pdfjs-dist/types/src/display/api";
import PageContainer from "../shared/PageContainer";
import PdfJsPage from "./PdfJsPage";
import {useFileRelations} from "../../../api/hooks/relations";
import {ApiCommentsInterface, ApiFileInterface, ApiRelationInterface} from "../../../api/models";
import RelationsPageInterface from "../shared/RelationsInterface";
import {useEditorViewerContext} from "../EditorViewerContext";
import CommentsPageInterface from "../shared/CommentsPageInterface";

type PagesType = PDFPageProxy[];

// We import this here so that it's only loaded during client-side rendering.
function sortPerPageIndex<T extends ApiCommentsInterface | ApiRelationInterface>(items: T[], pages: PagesType) {
    const perIndex : Record<number, Record<number, T>> = {}
    if (pages && items) {
        items?.forEach((r) => {
            r.file_bounding_blocks?.forEach((fbb) => {
                if (!perIndex[fbb.page_index]) {
                    perIndex[fbb.page_index] = {}
                }
                perIndex[fbb.page_index][r.id] = r
            })
        })
    }
    return perIndex
}


/**
 * Render a PDF and all its pages.
 */
function PdfjsViewer({ file, relations, PageChildComponent, comments }: { file: ApiFileInterface, comments: ApiCommentsInterface[], relations: ApiRelationInterface[], PageChildComponent?: React.FunctionComponent<{ pageIndex: number }> }) {
    const { scaler } = useEditorViewerContext()
    const fileId = file.id;
    const [pdf, setPdf] = useState<PDFDocumentProxy | undefined>()
    const [pages, setPages] = useState<PagesType>([]);

    useEffect(() => {
        (async function () {
            // We import this here so that it's only loaded during client-side rendering.
            // @ts-ignore
            const pdfJS = await import('pdfjs-dist/build/pdf');
            pdfJS.GlobalWorkerOptions.workerSrc =
                window.location.origin + '/pdf.worker.min.js';
            const loadingTask : PDFDocumentLoadingTask = pdfJS.getDocument(file.file_url)
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

    const relationsPerPageIndex = useMemo(() => sortPerPageIndex(relations, pages), [relations, pages])
    const commentsPerPageIndex = useMemo(() => sortPerPageIndex(comments, pages), [comments, pages])

    return (
        <>
            {pages.map((page, pageIndexNumber) => {
                const viewport = page.getViewport({ scale: scaler });
                return (
                    <PageContainer key={pageIndexNumber} style={{ height: viewport.height }}>
                        <PdfJsPage
                            page={page}
                            pageIndex={pageIndexNumber}
                            fileId={fileId}
                        />
                        {relationsPerPageIndex[pageIndexNumber] && relationsPerPageIndex[pageIndexNumber] && (
                            <RelationsPageInterface relations={Object.values(relationsPerPageIndex[pageIndexNumber])} />
                        )}
                        {commentsPerPageIndex && commentsPerPageIndex[pageIndexNumber] && (
                            <CommentsPageInterface comments={Object.values(commentsPerPageIndex[pageIndexNumber])} />
                        )}
                        {PageChildComponent && <PageChildComponent pageIndex={pageIndexNumber} />}
                    </PageContainer>
                )
            })}
        </>
    );
}

export default PdfjsViewer;

