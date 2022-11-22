import React, {useId} from 'react';
import { EmotionType, useEmotionCounts } from "../../api/hooks/emotions";
import {EmotionValue, emotionOptions} from "../../utils/enums";
import styles from './EmotionBar.module.scss';
import {useMutation} from "react-query";
import axios from "axios";
import cx from 'classnames';

export enum Variant {
    FooterInline = 'footer-inline',
    Inline = 'inline',
    Block = 'block',
}

interface EmotionBarProps {
    classNameNoCounts?: string,
    emotions: EmotionValue[],
    type: EmotionType,
    id: number,
    variant: Variant,
    onChange?: () => void
}

function EmotionBar({ type, id, emotions, variant, onChange, classNameNoCounts }: EmotionBarProps) {
    const { data, refetch } = useEmotionCounts(type, id);
    const { counts, my } = data || {};
    const barId = useId();

    const onSuccess = () => {
        if (onChange) onChange()
        refetch()
    };

    const { mutate: create } = useMutation(
        barId+'-create',
        ({ value }: { value: EmotionValue }) => axios.post('emotions', { type, type_id: id, emotion: value })
            .then(onSuccess),
        { onError: () => {} }
    );
    const { mutate: deleteEmotion } = useMutation(
        barId+'-delete',
        () => axios.delete(`emotions/${my?.id}`)
            .then(onSuccess),
        { onError: () => {} }
    );

    const postEmotion = (emotionValue: EmotionValue) => {
        create({ value: emotionValue })
    }

    const hasAnyCounts = counts && emotions.find(eValue => counts[eValue]);

    return (
        <div className={cx({
            [styles.Bar]: true,
            [styles.FooterInline]: variant === Variant.FooterInline,
            [styles.Block]: variant === Variant.Block,
            [styles.Inline]: variant === Variant.Inline,
            [styles.HasCounts]: hasAnyCounts,
            [styles.NoCounts]: !hasAnyCounts,
            [classNameNoCounts || '']: Boolean(classNameNoCounts) && !hasAnyCounts,
        })}>
            {emotions.map(((eValue) => {
                const { Icon } = emotionOptions[eValue];
                const isSelected = my?.emotion === eValue ? styles.Selected: '';

                return (
                    <div
                        key={eValue}
                        className={[styles.Button, isSelected].join(' ')}
                        onClick={() => isSelected ? deleteEmotion() : postEmotion(eValue)}
                    >
                        {counts ? counts[eValue]: undefined}
                        &nbsp;
                        <Icon size={10} />
                    </div>
                )
            }))}
        </div>
    );
}

export default EmotionBar;
