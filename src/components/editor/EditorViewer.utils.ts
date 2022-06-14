import {DragEvent} from "react";

export interface BoundingBox {
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
}
export interface ExtendedBoundingBox extends BoundingBox {
    selected: boolean,
}
export interface ApiBoundingBoxes {
    [k: number]: Array<BoundingBox>
}
export interface DragData {
    pageX: number,
    pageY: number,
}
export interface DragWindow {
    width: number,
    height: number,
    left: number,
    top: number,
}

const toPercentage = (x: number, denominator: number) => (denominator
    ? `${x / denominator * 100}%`
    : x);

const inDragWindow = (bb: BoundingBox, scaler: number, dragWindow: DragWindow | undefined): boolean => {
    if (!dragWindow) {
        return false;
    } else {
        // Check if each cornor of the bounding box is in the drag window
        const topLeftIsIn = bb.x * scaler >= dragWindow.left && bb.x * scaler <= dragWindow.left + dragWindow.width
            && bb.y * scaler >= dragWindow.top && bb.y * scaler <= dragWindow.top + dragWindow.height;
        const bottomLeftIsIn = bb.x * scaler >= dragWindow.left && bb.x * scaler <= dragWindow.left + dragWindow.width
            && (bb.y + bb.height) * scaler >= dragWindow.top && (bb.y + bb.height) * scaler <= dragWindow.top + dragWindow.height;
        const topRightIsIn = (bb.x + bb.width) * scaler >= dragWindow.left && (bb.x + bb.width) * scaler <= dragWindow.left + dragWindow.width
            && bb.y * scaler >= dragWindow.top && bb.y * scaler <= dragWindow.top + dragWindow.height;
        const bottomRightIsIn = (bb.x + bb.width) * scaler >= dragWindow.left && (bb.x + bb.width) * scaler <= dragWindow.left + dragWindow.width
            && (bb.y + bb.height) * scaler >= dragWindow.top && (bb.y + bb.height) * scaler <= dragWindow.top + dragWindow.height;
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
