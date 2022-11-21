import React, {useId} from 'react';
import { EmotionType, useEmotionCounts } from "../../api/hooks/emotions";
import {EmotionValue, emotionOptions} from "../../utils/enums";
import styles from './EmotionBar.module.scss';
import {useMutation} from "react-query";
import axios from "axios";

function EmotionBar({ type, id, emotions }: { emotions: EmotionValue[], type: EmotionType, id: number }) {
    const { data, refetch } = useEmotionCounts(type, id);
    const { counts, my } = data || {};
    const barId = useId();

    const { mutate: create } = useMutation(
        barId+'-create',
        ({ value }: { value: EmotionValue }) => axios.post('emotions', { type, type_id: id, emotion: value })
            .finally(() => refetch()),
        { onError: () => {} }
    );
    const { mutate: deleteEmotion } = useMutation(
        barId+'-delete',
        () => axios.delete(`emotions/${my?.id}`)
            .finally(() => refetch()),
        { onError: () => {} }
    );

    const postEmotion = (emotionValue: EmotionValue) => {
        create({ value: emotionValue })
    }

    return (
        <div className={styles.Bar}>
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
