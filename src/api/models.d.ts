import {BoundingBlock} from "../components/editor/EditorViewer.utils";
import {RelationValue} from "../utils/enums";

export interface ApiSourceInterface {
    title: string
    id: number
    created_at: string,
    updated_at: string,
}

export interface ApiRelationInterface {
    id: number
    title: string
    relation: RelationValue
    file_bounding_blocks?: ApiFileBoundingBlockInterface[]
    created_at: string,
    updated_at: string,
}

export interface ApiFileBoundingBlockInterface {
    file_id: number,
    text: string
    x: number
    y: number
    width: number
    height: number
    page_index: number
    id: number,
    pivot?: {
        relation_id: number,
        file_bounding_block_id: number
        index: number
    }
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

