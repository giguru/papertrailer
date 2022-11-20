import React, {useEffect, useId, useRef, useState} from 'react';
import { useMutation, useQuery } from "react-query";
import {Formik, FormikHelpers, FormikValues, useFormikContext} from "formik";
import axios, {AxiosError, AxiosResponse} from 'axios';
import Loading from "../loading/Loading";
import Alert from "@mui/material/Alert";
import {FormikProps} from "formik/dist/types";
import {ServerResponse} from "../../api/api";
import Button from "../button/Button";

function SaveButton() {
    const { isSubmitting } = useFormikContext();
    return (
        <Button type="submit" isBusy={isSubmitting} size="large">
            Save
        </Button>
    )
}

interface InnerFormInterface extends FormikProps<any> {
    children: React.ReactNode;
}

const InnerForm : React.FC<InnerFormInterface> = ({ handleSubmit, children }: InnerFormInterface) => {
    return (
        <form onSubmit={handleSubmit}>
            {children}
        </form>
    );
}

interface FormInput {
    isNew: boolean;
    endpoint: string;
    children: React.ReactNode,
    onSuccess?: () => void,
    initialFormData?: Record<string, any>,
}

function Form<TInputObject extends FormikValues, TResponseData = TInputObject>({
    isNew,
    endpoint,
    children,
    onSuccess,
    initialFormData = undefined,
}: FormInput) {
    const shouldFetch = !initialFormData;
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [submitError, setSubmitError] = useState('')
    const [feedback, setFeedback] = useState('')
    const id = useId();

    const onSuccessCallback = () => {
        if (typeof onSuccess === 'function') {
            onSuccess();
        }
        setSubmitError('');
        setFeedback('Saved');
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
            setFeedback('')
        }, 2000);
    }

    useEffect(() => {
        return () =>{
            clearTimeout(timeoutRef.current)
        }
    }, []);

    const catchApiError = (e: AxiosError<ServerResponse>) => {
        setSubmitError(e.response?.data?.message || e.message)
    }

    const putCall = (data: TInputObject) => axios.put<TInputObject, AxiosResponse<ServerResponse<TResponseData>>>(endpoint, data)
        .then(onSuccessCallback)
        .catch(catchApiError);
    const postCall = (data: TInputObject) => axios.post<TInputObject, AxiosResponse<ServerResponse<TResponseData>>>(endpoint, data)
        .then(onSuccessCallback)
        .catch(catchApiError);

    const {
        isLoading,
        isError,
        error,
        data: allData,
    } = useQuery(id,
        () => axios.get(endpoint).then(res => res.data),
        {
            enabled: !isNew && shouldFetch
        });

    const mutationFunction = isNew ? postCall : putCall;
    const { mutate } = useMutation(id, mutationFunction, {});

    if (isLoading) {
        return <Loading />;
    }

    if (isError) { // @ts-ignore
        return <Alert severity="error">{error}</Alert>;
    }
    const {
        data
    } : {
        data: TInputObject
    } = allData || { data: initialFormData };

    return (
        <Formik
            initialValues={data}
            onSubmit={(values: TInputObject, { setSubmitting }: FormikHelpers<TInputObject>) => mutate(values, {
                onSettled: () => {
                    setSubmitting(false);
                }
            })}
        >
            {(formikProps) => (
                <InnerForm {...formikProps}>
                    <>
                        {children}
                        {submitError && <Alert severity="error">{submitError}</Alert>}
                        {feedback && <Alert severity="success">{feedback}</Alert>}
                    </>
                </InnerForm>
            )}
        </Formik>
    );
}


export default Form;
export { SaveButton }
