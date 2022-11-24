import React from 'react';

const DIV = ' ';
const N = 4

export function splitWords(text: string | undefined) {
    return text ? text.split(DIV) : []
}

function TextSummary({ text }: { text: string | undefined }) {
    const words = splitWords(text)

    return (
        <span>
            {words.length > N * 2 ? `${words.slice(0, N).join(DIV)} ... ${words.slice(-N).join(DIV)}` : words.join(DIV)}
        </span>
    );
}

export default TextSummary;
