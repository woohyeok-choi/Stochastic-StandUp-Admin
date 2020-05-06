import * as React from 'react';

import {
    AppBar,
    Container,
    CssBaseline,
    IconButton,
    Toolbar,
    Typography
} from '@material-ui/core';
import {UserList} from "./component/UserList";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useState} from "react";
import {SelectedUser} from "./component/SelectedUser";



export const App: React.FunctionComponent = () => {
    const [state, setState] = useState<State>({
        showUsers: true,
        selectedEmail: undefined
    })


    const handleUserClick = (email: string) => {
        setState({
            ...state,
            showUsers: false,
            selectedEmail: email
        })
    }

    const handleBackClick = () => {
        setState({
            ...state,
            showUsers: true,
            selectedEmail: undefined,
        })
    }
    return (
        <Container maxWidth={'lg'}>
            <CssBaseline/>

            <AppBar position={"sticky"}>
                <Toolbar>
                    {
                        !state.showUsers ?
                            (<IconButton edge={'start'} color={'inherit'}>
                                <ArrowBackIcon onClick={handleBackClick}/>
                            </IconButton>)
                            : undefined
                    }

                    <Typography variant={'h6'}>
                        { state.showUsers ? "Users" : state.selectedEmail }
                    </Typography>
                </Toolbar>
            </AppBar>
            <div>
                {
                    state.showUsers ?
                        <UserList onUserClick={handleUserClick}/> :
                        (state.selectedEmail ? <SelectedUser email={state.selectedEmail}/> : undefined)
                }
            </div>
        </Container>
    )
}

interface State {
    showUsers: boolean,
    selectedEmail?: string
}