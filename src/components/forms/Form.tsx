import React, { useId } from 'react';
import { useMutation, useQuery } from "react-query";
import { Formik, FormikHelpers, FormikValues } from "formik";
import axios from 'axios';
import Loading from "../loading/Loading";
import Alert from "@mui/material/Alert";
import {FormikProps} from "formik/dist/types";

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
}

const Form: React.FC<FormInput> = <TInputObject extends FormikValues>({
    isNew,
    endpoint,
    children,
}: FormInput) => {
    const id = useId();

    const putCall = (data: TInputObject) => axios.put(endpoint, data);
    const postCall = (data: TInputObject) => axios.post(endpoint, data);

    const {
        isLoading,
        isError,
        error,
        data: allData,
    } = useQuery(id,
        () => axios.get(endpoint).then(res => res.data),
        {
            enabled: !isNew
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
    } = allData;

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
                    {children}
                </InnerForm>
            )}
        </Formik>
    );
};
export default Form;
