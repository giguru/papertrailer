import {BoundingBlock} from "../components/editor/EditorViewer.utils";

export interface ApiSourceInterface {
    title: string
    id: number
    created_at: string,
    updated_at: string,
}

export interface ApiFileInterface {
    id: number,
    filename: string,
    file_url: string,
    size_width: number,
    size_height: number,
    processed: 0 | 1,
    processed_at: string | null,
    parent_file_id: number | null,
    files: undefined | ApiFileInterface[],
    file_bounding_blocks: undefined | Array<BoundingBlock>
}

