import React, {useState} from 'react';
import ModalBox from "../../layout/ModalBox";
import {ApiLabelInterface, ApiSharingInterface} from "../../../api/models";
import styles from './ShareFileModalbox.module.scss';
import SearchBar from "../../search-input/SearchBar";
import {useMutation} from "react-query";
import axios, {AxiosResponse} from "axios";
import Alert from "@mui/material/Alert";
import {ServerResponse} from "../../../api/api";
import UserList from "../../lists/UserList";
import moment from "moment";
import DateSpan from "../../texts/DateSpan";
import DeleteButton from "../../forms/DeleteButton";


interface Props {
    initLabels?: ApiLabelInterface[]
    sharings: ApiSharingInterface[]
    buttonClassName?: string,
    fileId: number,
    onSuccess: () => void,
}

function ShareFileModalBox({ sharings, onSuccess, buttonClassName, fileId } : Props) {
    const [error, setError] = useState('');
    const [addedSharings, setSharings] = useState<ApiSharingInterface[]>([])
    const [deletedIds, setDeletedIds] = useState<number[]>([])

    const { mutateAsync } = useMutation(
        'share-file',
        (id: number) => axios
            .post<ApiSharingInterface, AxiosResponse<ServerResponse<ApiSharingInterface>>>('sharings', { user_id: id, file_id: fileId })
            .then((resp) => {
                if (resp.data.data) {
                    setSharings(addedSharings.concat([resp.data.data]));
                }
            })
            .catch((e) => {
                setError(e.message)
            }),
    )

    const allSharings = addedSharings
        .concat(sharings || [])
        .filter((sharing) => deletedIds.indexOf(sharing.id) === -1);

    return (
        <ModalBox.ViaButton
            buttonText="+ Share"
            header="Share file"
            size="small"
            variant="text"
            onClose={() => {
                if (onSuccess) {
                    onSuccess()
                }
            }}
            buttonClassName={buttonClassName}
        >
            <div className={styles.Content} onClick={(e) => e.stopPropagation()}>
                <SearchBar
                    types={['user']}
                    placeholder="Find users"
                    onSelect={({ clearInput, item, input }) => {
                        mutateAsync(item.object.id)
                            .then(() => {
                                clearInput();
                                input?.focus()
                            })
                    }}
                    autoFocus
                    expands={false}
                />
                <div className="spacer-sm" />
                {error && <Alert color="error">{error}</Alert>}
                {allSharings.length > 0 && (
                    <>
                        <strong>Shared with {allSharings.length} users</strong>
                        <UserList
                            users={allSharings.map((sharing) => sharing.user)}
                            contentComponent={({ user }) => {
                                const sharing = allSharings.find(s => s.user_id === user.id);
                                return sharing ? (
                                    <>
                                        Shared on&nbsp;
                                        <DateSpan date={sharing?.created_at} />
                                        <DeleteButton
                                            endpoint={`/sharings/${sharing.id}`}
                                            onSuccess={() => {
                                                setDeletedIds([...deletedIds, sharing.id])
                                            }}
                                            verbString="unshare"
                                            size="small"
                                        />
                                    </>
                                ) : <span />
                            }}
                        />
                    </>
                )}
            </div>
        </ModalBox.ViaButton>
    );
}

export default ShareFileModalBox;
