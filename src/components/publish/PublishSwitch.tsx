import React, {useState} from 'react';
import {Switch} from "@mui/material";
import {useMutation} from "react-query";
import axios from "axios";
import Loader from "../loader/Loader";
import {useDisappearingFeedback} from "../../utils/hooks/useDisappearingFeedback";
import LocalAlert from "../LocalAlert";

interface PublishSwitchProps {
    subjectId: number
    defaultChecked: boolean
}

function PublishSwitch({ subjectId, defaultChecked } : PublishSwitchProps) {
    const [checked, setChecked] = useState<boolean>(defaultChecked)
    const { feedback, setFeedback } = useDisappearingFeedback()
    const key = 'is_public';

    const { mutate: updatePublishState, isLoading } = useMutation(
        ['toggle-public', subjectId],
        (newPublicStatus: boolean) => {
            const method = newPublicStatus ? axios.post : axios.delete;
            return method(`files/${subjectId}/public`)
                .then(({ data }) => {
                    setChecked(newPublicStatus);
                    setFeedback(data.message);
                })
        },
        {
                onSettled: () => {
            },
        }
    );

    return (
        <span onClick={event => event.stopPropagation()}>
            {feedback && <LocalAlert>{feedback}</LocalAlert>}
            <Switch
                name={key}
                checked={checked}
                disabled={isLoading}
                onChange={() => updatePublishState(!checked)}
            />
            {isLoading && <Loader size="inline" />}
        </span>
    );
}

export default PublishSwitch;
