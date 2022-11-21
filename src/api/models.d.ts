import {BoundingBlock} from "../components/editor/EditorViewer.utils";
import {RelationValue, EmotionValue} from "../utils/enums";

interface Timestamps {
    created_at: string,
    updated_at: string,
}

type ApiEmotionCounts = Record<EmotionValue, number>

type ApiRelationInterface = Timestamps & {
    id: number
    title: string
    relation: RelationValue
    created_by?: ApiUserInterface
    file_bounding_blocks?: ApiFileBoundingBlockInterface[]
}

export type ApiUserInterface = Timestamps & {
    id: number
    first_name: string
    last_name: string
}

type ApiCommentsInterface = Timestamps & {
    id: number
    created_by_id: number
    created_by: ApiUserInterface,
    text: string
}

type ApiFileBoundingBlockInterface = Timestamps & {
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

type ApiFileInterface = Timestamps & {
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

export {
    Emotion,
    ApiCommentsInterface,
    ApiEmotionCounts,
    ApiFileInterface,
    ApiFileBoundingBlockInterface,
    ApiRelationInterface,
}
