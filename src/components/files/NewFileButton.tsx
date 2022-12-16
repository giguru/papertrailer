import React, {useState} from 'react';
import Paragraph from "../texts/Paragraph";
import FileUploaderList from "../forms/FileUploaderList";
import ModalBox from "../layout/ModalBox";
import RadioButtonsGroup from "../forms/RadioButtonsGroup";

const acceptTypes = '.pdf, .jpg, .jpeg, .png, .docx, .doc, .pptx, .ppt';

enum SupportedLanguages {
    'Dutch' = 'nl',
    'English' = 'en',
    'French' = 'fr',
    'German' = 'de',
    'Hungarian' = 'hu',
    'Italian' = 'it',
    'Spanish' = 'es',
}

function NewFileButton() {
    const [lang, setLang] = useState<SupportedLanguages | string>(SupportedLanguages.English);

    return (
        <ModalBox.ViaButton
            buttonText="New file"
            header="Upload new files"
            closeButtonText="Finish uploading"
            variant="outlined"
        >
            <RadioButtonsGroup
                // @ts-ignore
                options={Object.keys(SupportedLanguages).map((v) => ({ value: SupportedLanguages[v], label: v }))}
                name="language"
                helperText="Our system will scan any file on text and make it's text selectable and searchable"
                label="File language"
                value={lang}
                inlineOptions
                onChange={(e) => setLang(`${e.target.value}`)}
            />
            <FileUploaderList
                endpoint="/files"
                additionalData={{
                    lang: lang
                }}
                accept={acceptTypes}
            />
            <Paragraph>
                <strong>The uploaded files will be converted into pdf's and cannot be changed afterwards.</strong>
            </Paragraph>
        </ModalBox.ViaButton>
    );
}

export default NewFileButton;
