import {PDFPageProxy} from "pdfjs-dist";
import React, {useCallback, useEffect, useRef, useState} from "react";
import * as PDFJS from "pdfjs-dist";
import styles from "./PdfjsViewer.module.scss";
import {cumulativeOffset, PdfJSSelectionBox } from "../EditorViewer.utils";
import {useEditorViewerContext} from "../EditorViewerContext";
import InteractionInterface from "./InteractionInterface";

function convertSelection(selection: Selection, canvas: HTMLCanvasElement, scaler: number): PdfJSSelectionBox {
    const imageContainerOffset = canvas ? cumulativeOffset(canvas) : undefined;
    const range = selection.getRangeAt(0);
    const { left, top } = range.getBoundingClientRect()

    // TODO fix bounding box. Now you select the entire parentElement, but if that contains 10 words and you only selected
    //   2 words, the bounding box is now around all 10 words.
    return {
        text: selection?.toString() || '',
        x: (left + window.scrollX - (imageContainerOffset?.left || 0)) / scaler,
        y: (top + window.scrollY - (imageContainerOffset?.top || 0)) / scaler,
        width: ((range.endContainer.parentElement?.offsetLeft || 0)
            + (range.endContainer.parentElement?.offsetWidth || 0)
            - (range.startContainer.parentElement?.offsetLeft || 0)) / scaler,
        height: ((range.endContainer.parentElement?.offsetTop || 0)
            + (range.endContainer.parentElement?.offsetHeight || 0)
            - (range.startContainer.parentElement?.offsetTop || 0)) / scaler,
        originalSelection: selection
    }
}

interface PdfJSPageProps {
    page: PDFPageProxy
    pageIndex: number
    fileId: number
}

export default function PdfJsPage({ page, pageIndex, fileId }: PdfJSPageProps) {
    const { setSelectedContent, clearSelectedContent, scaler } = useEditorViewerContext()
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const textLayerRef = useRef<HTMLDivElement | null>(null);
    const [textLayerStyle, setTextLayerStyle] = useState({});

    useEffect(() => {
        const viewport = page.getViewport({ scale: scaler });

        // Prepare canvas using PDF page dimensions.
        const canvas = canvasRef.current;
        const textLayer = textLayerRef.current;
        if (canvas && textLayer) {
            const canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context.
            const renderContext = { canvasContext, viewport };
            const renderPromise = page.render(renderContext).promise

            renderPromise
                .then(function () {
                    // Returns a promise, on resolving it will return text contents of the page
                    return page.getTextContent();
                })
                .then(function (textContent) {
                    // Assign CSS to the text-layer element
                    textLayer.style.height = `${canvas.offsetHeight}`;
                    textLayer.style.width = `${canvas.offsetWidth}`;

                    // Pass the data to the method for rendering of text over the pdf canvas.
                    // @ts-ignore
                    PDFJS.renderTextLayer({
                        textContent: textContent,
                        container: textLayer,
                        viewport: viewport,
                        textDivs: []
                    });
                });
        }
        return () => {
            // page.cleanup()
        }
    }, [page, setSelectedContent])

    const onMouseUp = useCallback(() => {
        let selObj : Selection|null = null;

        if (window.getSelection) {
            selObj = window.getSelection();
        } else if (document.getSelection) {
            selObj = document.getSelection();
        }

        if (selObj instanceof Selection && selObj.toString() && canvasRef.current) {
            setSelectedContent({
                ...convertSelection(selObj, canvasRef.current, scaler),
                fileId: fileId,
                selected: true,
                pageIndex: pageIndex,
            })
        } else {
            clearSelectedContent();
        }
    }, [setSelectedContent, clearSelectedContent])

    // @ts-ignore
    return (
        <>
            <canvas ref={canvasRef} />
            <div
                className={styles.TextLayer}
                ref={textLayerRef}
                style={textLayerStyle}
                onMouseUp={onMouseUp}
            />
            <InteractionInterface pageIndex={pageIndex} />
        </>
    )
}
