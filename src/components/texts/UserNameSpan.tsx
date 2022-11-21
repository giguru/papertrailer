import React from 'react';
import {ApiUserInterface} from "../../api/models";
import styles from './UserNameSpan.module.scss';

function UserNameSpan({ user }: { user: ApiUserInterface }) {
    return (
        <div className={styles.UserNameSpan}>
            {user.first_name}
            &nbsp;
            {user.last_name}
        </div>
    );
}

export default UserNameSpan;
