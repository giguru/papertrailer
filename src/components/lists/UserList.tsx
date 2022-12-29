import React from 'react';
import { default as MuiList } from '@mui/material/List'
import {ListItem, ListItemAvatar, ListItemText} from "@mui/material";
import {ApiUserInterface} from "../../api/models";
import UserNameSpan from "../texts/UserNameSpan";
import Avatar from "@mui/material/Avatar";

interface Props {
    users: ApiUserInterface[]
    contentComponent: ({ user }: { user: ApiUserInterface }) => JSX.Element
}

function UserList({ users, contentComponent: ContentComponent }: Props) {
    return (
        <MuiList sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {users.map((user) => (
                <ListItem key={user.id} alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar
                            alt={`${user?.first_name} ${user?.last_name}`}
                            src="/static/images/avatar/1.jpg"
                        />
                    </ListItemAvatar>
                    <ListItemText
                        style={{ lineHeight: '1rem' }}
                        primary={<UserNameSpan user={user} />}
                        secondary={<ContentComponent user={user} />}
                    />
                </ListItem>
            ))}
        </MuiList>
    );
}

export default UserList;
