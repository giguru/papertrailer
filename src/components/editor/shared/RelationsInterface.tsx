import {ApiFileBoundingBlockInterface, ApiFileInterface, ApiRelationInterface} from "../../../api/models";
import React, {Fragment, useMemo, useState} from "react";
import styles from './RelationsInterface.module.scss';
import {relationOptions} from "../../../utils/enums";
import RelationPopUp, {fileBoundingBlockToSelection} from "../RelationPopUp";
import {useEditorViewerContext} from "../EditorViewerContext";
import FloatingPane from "../../FloatingPane";
import CommentSection from "../../comments/CommentSection";
import DividerWithText from "../../DividerWithText";
import DateSpan from "../../texts/DateSpan";
import UserNameSpan from "../../texts/UserNameSpan";
import Header from "../../texts/Header";
import StatStrip from "../../texts/StatStrip";

const relevantForFile = (file: ApiFileInterface | undefined, fileId: number) => file && file.id === fileId
type ExtendedApiRelationInterface = ApiRelationInterface & { indent: number }

/**
 * Display one relation in the editor including the indicator and edit / comment pane.
 *
 * @param relation
 */
function RelationDisplay({ relation }: { relation: ExtendedApiRelationInterface }) {
    const { file, scaler } = useEditorViewerContext()
    const [isOpen, setOpenRelation] = useState(false)
    const open = () => setOpenRelation(true)

    const color = relationOptions[relation.relation].color;
    const fileBoundingBlocks = relation.file_bounding_blocks || [];
    const blockA = fileBoundingBlocks.find(f => f.pivot?.index === 0);
    const blockB = fileBoundingBlocks.find(f => f.pivot?.index === 1);

    return (
        <Fragment>
            {fileBoundingBlocks.map((fbb) => {
                const { y, height, x, width, id, file_id: fileId } = fbb;
                if (!file || !relevantForFile(file, fileId)) return null;

                return (
                    <div
                        className={styles.Relation}
                        style={{ top: y * scaler }}
                        key={id}
                    >
                        <div
                            className={`${styles.Indicator} ${isOpen ? styles.OpenIndicator: ''}`}
                            style={{ height: height * scaler, backgroundColor: color, color, left: `${-20 - relation.indent * 8}px` }}
                            onClick={open}
                        >
                            <span className={styles.RelationType}>{relationOptions[relation.relation].label}</span>
                        </div>
                        <div
                            className={styles.ContentIndicator}
                            style={{
                                left: x * scaler,
                                width: width * scaler,
                                height: height * scaler,
                                backgroundColor: color
                            }}
                            onClick={open}
                        />
                        {blockA && blockB && isOpen && (
                            <FloatingPane
                                onClose={() => setOpenRelation(false)}
                                position={{ top: 30, left: -350 }}
                                className={styles.ContentModal}
                            >
                                <FloatingPane.Content>
                                    <StatStrip
                                        elements={[
                                            <span>
                                                Created&nbsp;
                                                <DateSpan date={relation.created_at} />
                                                {relation.created_by
                                                    && <span>By <UserNameSpan user={relation.created_by} /></span>}
                                            </span>,
                                        ]}
                                    />
                                    <RelationPopUp
                                        relationId={relation.id}
                                        selectionA={fileBoundingBlockToSelection(blockA)}
                                        selectionB={fileBoundingBlockToSelection(blockB)}
                                        initialFormData={{
                                            ...relation
                                        }}
                                    />
                                </FloatingPane.Content>

                                <FloatingPane.Footer>
                                    <CommentSection type="relation" id={relation.id} />
                                </FloatingPane.Footer>
                            </FloatingPane>
                        )}
                    </div>
                );
            })}
        </Fragment>
    )
}

/**
 * Display existing relations in the editor, so users can modify/comment/etc.
 *
 * @param relations Relevant relations for a page.
 * @constructor
 */
export default function RelationsInterface({ relations }: { relations: ApiRelationInterface[] }) {
    const { file } = useEditorViewerContext()

    const sortedRelations = useMemo(() => {
            let inWindow: Array<ApiRelationInterface & { top: number, height: number }> = [];

            // TODO move indentation to file bounding block instead of relation. Case: when file is relating to itself.
            const sorted = relations
                .map((r) => {
                    const fbbs = r.file_bounding_blocks?.filter((fbb) => relevantForFile(file, fbb.file_id)) || [];
                    let minFbb: ApiFileBoundingBlockInterface = fbbs[0];
                    fbbs.forEach((fbb) => {
                        if (fbb.y < minFbb.y) minFbb = fbb
                    })
                    return {
                        ...r,
                        top: minFbb.y,
                        height: minFbb.height,
                    }
                })
                .sort((a, b) => {
                    if (a.top === b.top) return 0;
                    return a.top > b.top ? 1 : 1;
                });

            return sorted.map<ExtendedApiRelationInterface>((r) => {
                // Remove all in window
                inWindow = inWindow.filter((windowR) =>  r.top <= windowR.top + windowR.height)

                // Add current
                inWindow.push(r);

                return {...r, indent: inWindow.length - 1}
            })
        },
        [file, relations],
    );

    return (
        <>
            {sortedRelations.map(relation => <RelationDisplay relation={relation} key={relation.id} />)}
        </>
    )
}
