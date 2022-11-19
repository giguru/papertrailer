import React, {useContext, useState} from 'react';
import {Formik, FormikHelpers} from "formik";
import {EditorViewerContextProvider, useEditorViewerContext} from "../components/editor/EditorViewerContext";
import LintMenu from "../components/editor/shared/LintMenu";
import EditorViewer from "../components/editor/EditorViewer";
import ViewSplitter from "../components/layout/ViewSplitter";
import SearchDocumentView from "./views/SearchDocumentView";
import SelectionPopUp from "../components/editor/BoundingBoxesSelectionPopUp";
import {ViewSplitterContext} from "../components/layout/ViewSplitter.utils";
import {EditorContextProvider, FlowData, useEditorContext} from "../components/editor/EditorContext";
import RadioButtonsGroup from "../components/forms/RadioButtonsGroup";
import Button from "../components/button/Button";
import {useParams} from "react-router";
import {relationOptions, RelationValue} from "../utils/enums";
import RelationPopUp from "../components/editor/RelationPopUp";
import Snippet from "../components/snippets/Snippet";

const mainViewEditorId: string = 'main';
const otherViewEditorId: string = 'other';

interface MainViewFlowData extends FlowData {
    relation: RelationValue
}

interface RouteParams extends Record<string, string> {
    fileId: string
}

function MainView() {
    const { fileId } = useParams<RouteParams>();
    const { openView, activeIndex } = useContext(ViewSplitterContext);
    const { setSelectedBoundingBoxes, addFlowData } = useEditorContext();
    const { clearSelectedContent } = useEditorViewerContext();
    const initialValues: MainViewFlowData = { relation: RelationValue.Relates };

    return (
        <>
            <LintMenu />
            {fileId && (
                <EditorViewer
                    fileId={fileId}
                    isActive={activeIndex === 0}
                    Component={({ selection }) => (
                        <SelectionPopUp
                            selection={selection}
                            onCancel={clearSelectedContent}
                        >
                            <Formik
                                initialValues={initialValues}
                                onSubmit={(values: MainViewFlowData, { setSubmitting }: FormikHelpers<MainViewFlowData>) => {
                                    addFlowData({
                                        relation: values.relation,
                                    });
                                    setSelectedBoundingBoxes(mainViewEditorId, selection);
                                    setSubmitting(false);
                                }}
                            >
                                {(formikProps) => (
                                    <form onSubmit={formikProps.handleSubmit}>
                                        <Snippet text={selection.text} />
                                        <div>
                                            <RadioButtonsGroup.Formik
                                                label="Relation"
                                                options={Object.values(relationOptions)}
                                                name="relation"
                                            />
                                        </div>
                                        <Button
                                            onClick={async () => {
                                                openView(1);
                                                await formikProps.submitForm();
                                            }}
                                        >
                                            Link to other document
                                        </Button>
                                    </form>
                                )}
                            </Formik>
                        </SelectionPopUp>
                    )}
                />
            )}
        </>
    );
}

function OtherView() {
    const { fileId } = useParams<RouteParams>();
    const { openView } = useContext(ViewSplitterContext);
    const { selectedBoundingBoxesPerEditor, flowData, setSelectedBoundingBoxes } = useEditorContext();
    const { clearSelectedContent, setSelectedContent } = useEditorViewerContext();
    const [selectedFile, setSelectedFile] = useState<{id: number} | undefined>();

    const selectionA = selectedBoundingBoxesPerEditor[mainViewEditorId];

    const cancel = () => {
        openView(0)
        clearSelectedContent()
    }

    if (!selectedFile) {
        return (
            <SearchDocumentView
                selection={selectionA}
                onSelect={(newlySelectedFile, newSelection) => {
                    setSelectedFile(newlySelectedFile);
                    if (newSelection) {
                        setSelectedContent(newSelection);
                    }
                }}
                close={cancel}
            />
        );
    }

    if (!flowData.relation) {
        return <span>No relation was selected</span>;
    }

    return (
        <>
            <LintMenu
                preChildren={(
                    <>
                        <Button onClick={() => setSelectedFile(undefined)}>Choose other document</Button>
                    </>
                )}
            />
            <div>
            {selectionA && flowData.relation
                ? (
                    <EditorViewer
                        fileId={selectedFile.id}
                        Component={({ selection: selectionB }) => {
                            const initialFormData = {
                                fileA: selectedFile.id,
                                fileB: fileId,
                                relation: flowData.relation || RelationValue.Relates,
                            }
                            /* TODO fix saving
                            if ("boundingBlocks" in selectionB) {
                                initialFormData.file_bounding_blocks._ids =
                                    initialFormData.file_bounding_blocks._ids.concat(selectionB.boundingBlocks.map(bb => bb.id))
                            }

                            if ("boundingBlocks" in selectionA) {
                                initialFormData.file_bounding_blocks._ids =
                                    initialFormData.file_bounding_blocks._ids.concat(selectionA.boundingBlocks.map(bb => bb.id))
                            }
                            */

                            return (
                                <SelectionPopUp
                                    selection={selectionB}
                                    onCancel={clearSelectedContent}
                                    header="Create relation"
                                >
                                    <RelationPopUp
                                        selectionA={selectionA}
                                        selectionB={selectionB}
                                        initialFormData={initialFormData}
                                        onSuccess={() => {
                                            setSelectedBoundingBoxes(mainViewEditorId, undefined);
                                            cancel();
                                        }}
                                    />
                                </SelectionPopUp>
                            )
                        }}
                    />
                ) : (
                    <div>No initial selection...</div>
                )}
            </div>
        </>
    );
}

function Editor() {
    return (
        <EditorContextProvider>
            <ViewSplitter defaultActiveIndex={0}>
                <ViewSplitter.Side index={0} alwaysShow>
                    <EditorViewerContextProvider id={mainViewEditorId}>
                        <MainView  />
                    </EditorViewerContextProvider>
                </ViewSplitter.Side>
                <ViewSplitter.Side index={1}>
                    <EditorViewerContextProvider id={otherViewEditorId}>
                        <OtherView />
                    </EditorViewerContextProvider>
                </ViewSplitter.Side>
            </ViewSplitter>
        </EditorContextProvider>
    );
}

export default Editor;
