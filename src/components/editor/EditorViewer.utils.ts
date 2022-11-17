import {DragEvent} from "react";

// Every type of editor must eventually yield a selection box. Do not export. Create extended classes instead.
interface SelectionBox {
    text: string
    x: number
    y: number
    width: number
    height: number
}

export interface BoundingBlock extends SelectionBox {
    id: number,
    line_num: number,
    block_num: number,
}

export interface PdfJSSelectionBox extends SelectionBox {
    originalSelection: Selection
}

export interface SelectionBoxContextProps {
    selected: boolean,
    fileId: number,
}

export type PdfJSBoxSelection = PdfJSSelectionBox & SelectionBoxContextProps;

export type BoundingBoxSelection = SelectionBoxContextProps & {
    text: string,
    boundingBlocks: BoundingBlock[],
}

export type AnySelection = BoundingBoxSelection | PdfJSBoxSelection

export interface DragData {
    pageX: number,
    pageY: number,
}
export interface DragWindow {
    width: number,
    height: number,
    x: number,
    y: number,
}

const toPercentage = (x: number, denominator: number) => (denominator
    ? `${x / denominator * 100}%`
    : x);

const inDragWindow = (bb: BoundingBlock, scaler: number, dragWindow: DragWindow | undefined): boolean => {
    if (!dragWindow) {
        return false;
    } else {
        // Check if each cornor of the bounding box is in the drag window
        const topLeftIsIn = bb.x * scaler >= dragWindow.x && bb.x * scaler <= dragWindow.x + dragWindow.width
            && bb.y * scaler >= dragWindow.y && bb.y * scaler <= dragWindow.y + dragWindow.height;
        const bottomLeftIsIn = bb.x * scaler >= dragWindow.x && bb.x * scaler <= dragWindow.x + dragWindow.width
            && (bb.y + bb.height) * scaler >= dragWindow.y && (bb.y + bb.height) * scaler <= dragWindow.y + dragWindow.height;
        const topRightIsIn = (bb.x + bb.width) * scaler >= dragWindow.x && (bb.x + bb.width) * scaler <= dragWindow.x + dragWindow.width
            && bb.y * scaler >= dragWindow.y && bb.y * scaler <= dragWindow.y + dragWindow.height;
        const bottomRightIsIn = (bb.x + bb.width) * scaler >= dragWindow.x && (bb.x + bb.width) * scaler <= dragWindow.x + dragWindow.width
            && (bb.y + bb.height) * scaler >= dragWindow.y && (bb.y + bb.height) * scaler <= dragWindow.y + dragWindow.height;
        return topLeftIsIn || bottomLeftIsIn || topRightIsIn || bottomRightIsIn;
    }
}

function cumulativeOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

const dragEventToDragData = (ev: DragEvent<HTMLDivElement>): DragData => {
    return {
        pageX: ev.pageX,
        pageY: ev.pageY,
    };
}

export { inDragWindow, cumulativeOffset, toPercentage, dragEventToDragData };
