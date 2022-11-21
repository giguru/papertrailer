import React, {useId} from 'react';
import { EmotionType, useEmotionCounts } from "../../api/hooks/emotions";
import {EmotionValue, emotionOptions} from "../../utils/enums";
import styles from './EmotionBar.module.scss';
import {useMutation} from "react-query";
import axios from "axios";

function EmotionBar({ type, id, emotions }: { emotions: EmotionValue[], type: EmotionType, id: number }) {
    const { counts, refetch } = useEmotionCounts(type, id);
    const barId = useId();

    const { mutate } = useMutation(
        barId,
        ({ value }: { value: EmotionValue }) => axios.post('emotions', { type, type_id: id, emotion: value })
            .then(() => refetch()),
        { onError: () => {} }
    );

    const postEmotion = (emotionValue: EmotionValue) => {
        mutate({ value: emotionValue })
    }

    return (
        <div className={styles.Bar}>
            {emotions.map(((eValue) => {
                const { Icon } = emotionOptions[eValue];
                return (
                    <div key={eValue} className={styles.Button} onClick={() => postEmotion(eValue)}>
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