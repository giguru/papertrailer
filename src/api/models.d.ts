import {BoundingBlock} from "../components/editor/EditorViewer.utils";
import {RelationValue} from "../utils/enums";

interface Timestamps {
    created_at: string,
    updated_at: string,
}

export type ApiRelationInterface = Timestamps & {
    id: number
    title: string
    relation: RelationValue
    file_bounding_blocks?: ApiFileBoundingBlockInterface[]
}

export type ApiFileBoundingBlockInterface = Timestamps & {
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
}

export type ApiFileInterface = Timestamps & {
    id: number,
    title: string,
    description: string,
    filename: string,
    file_url: string,
    size_width: number,
    size_height: number,
    processed: 0 | 1,
    processed_at: string | null,
    parent_file_id: number | null,
    files: undefined | ApiFileInterface[],
    file_bounding_blocks: undefined | Array<BoundingBlock>,
}

