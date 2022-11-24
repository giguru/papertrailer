import React, {useEffect, useId, useRef, useState} from 'react';
import { useMutation, useQuery } from "react-query";
import {Formik, FormikErrors, FormikHelpers, FormikValues, useFormikContext} from "formik";
import axios, {AxiosError, AxiosResponse} from 'axios';
import Loading from "../loading/Loading";
import Alert from "@mui/material/Alert";
import {FormikProps} from "formik/dist/types";
import {ServerResponse, ServerErrorResponse} from "../../api/api";
import Button from "../button/Button";
import styles from './Form.module.scss';


function SaveButton({ text = 'Save' }: { text?: string }) {
    const { isSubmitting } = useFormikContext();
    return (
        <Button type="submit" isBusy={isSubmitting} size="large" variant="contained" className={styles.SaveButton}>
            {text}
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

export type FormProps<TResponseData> = {
    isNew: boolean;
    endpoint: string;
    children: React.ReactNode,
    onSuccess?: (data: ServerResponse<TResponseData>) => void,
    initialFormData?: Record<string, any>
}

function Form<TInputObject extends FormikValues, TResponseData = TInputObject>({
    isNew,
    endpoint,
    children,
    onSuccess,
    initialFormData = undefined,
}: FormProps<TResponseData>) {
    const shouldFetch = !initialFormData;
    const timeoutRef = useRef<NodeJS.Timeout>();
    const [submitError, setSubmitError] = useState('')
    const [feedback, setFeedback] = useState('')
    const id = useId();

    const onSuccessCallback = (resp: AxiosResponse<ServerResponse<TResponseData>>) => {
        if (typeof onSuccess === 'function') {
            onSuccess(resp.data);
        }
        setSubmitError('');
        setFeedback(resp.data?.message || 'Saved.');
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
        setSubmitError(e.response?.data?.message || e.message);
    }

    const putCall = (data: TInputObject) => axios.put<TInputObject, AxiosResponse<ServerResponse<TResponseData>>>(endpoint, data)
        .then(onSuccessCallback)
    const postCall = (data: TInputObject) => axios.post<TInputObject, AxiosResponse<ServerResponse<TResponseData>>>(endpoint, data)
        .then(onSuccessCallback)

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
    const { mutate } = useMutation(id, mutationFunction, { onError: catchApiError });

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
            onSubmit={(values: TInputObject, { setSubmitting, setFieldTouched, setErrors }: FormikHelpers<TInputObject>) => mutate(values, {
                onSettled: () => {
                    setSubmitting(false);
                },
                // @ts-ignore
                onError: (e: AxiosError<ServerErrorResponse<TInputObject>>) => {
                    const errorObject: FormikErrors<TInputObject> = {};
                    for (const fieldKey in e.response?.data?.errors) {
                        const fieldErrors = e.response?.data?.errors[fieldKey]
                        if (Array.isArray(fieldErrors)) {
                            errorObject[fieldKey] = fieldErrors.join(' ');
                        } else if (typeof fieldErrors === 'string') {
                            errorObject[fieldKey] = fieldErrors;
                        }
                    }
                    setErrors(errorObject)
                },
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
