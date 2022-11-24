import {BoundingBlock} from "../components/editor/EditorViewer.utils";
import {RelationValue, EmotionValue} from "../utils/enums";

interface Timestamps {
    created_at: string,
    updated_at: string,
}

type ApiEmotionInterface = {
    id: number,
    emotion: EmotionValue
}

export type CommentType = 'relation' | 'file' | 'comment'

type ApiEmotionCounts = {
    counts: Record<EmotionValue, number>
    my: ApiEmotionInterface
}
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
    type: CommentType
    created_by_id: number
    created_by: ApiUserInterface,
    file_bounding_blocks?: ApiFileBoundingBlockInterface[]
    text: string
    comments?: ApiCommentsInterface[]
    comments_count?: number
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
    comments_count: number,
    relations_count: number,
    processed: 0 | 1,
    processed_at: string | null,
    parent_file_id: number | null,
    files: undefined | ApiFileInterface[],
    created_by?: ApiUserInterface,
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
