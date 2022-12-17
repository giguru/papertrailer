import React, {useContext, useEffect, useState} from "react";
import {ApiUserInterface} from "../../api/models";
import {useQuery} from "react-query";
import axios from "axios";
import {ServerGetResponse} from "../../api/api";
import {useNavigate} from "react-router";
import {routes} from "../../utils/routes";

interface ContextProps {
    loggedInUser?: ApiUserInterface
    logout: () => void
    storeLogin: (loginToken: string) => void
}

const AuthContext = React.createContext<ContextProps>({
    loggedInUser: undefined,
    logout: () => {},
    storeLogin: () => {}
});

export function useAuth() {
    return useContext(AuthContext);
}

const loginTokenName = 'papertrailer_token'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const nav = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem(loginTokenName));

    const { data: fullData, error, isLoading, isFetching, refetch, remove } = useQuery(
        ['me', token],
        () => axios.get<ServerGetResponse<ApiUserInterface>>(`/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true
        }),
        { retry: 0, enabled: Boolean(token) }
    );

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }, [token]);

    const logout = () => {
        localStorage.removeItem(loginTokenName)
        setToken(null);
        nav(routes.publicNets);
    };

    return (
        <AuthContext.Provider value={{
            loggedInUser: fullData?.data.data,
            logout,
            storeLogin: (token) => {
                localStorage.setItem(loginTokenName, token)
                setToken(token);
            },
        }}>
            {children}
        </AuthContext.Provider>
    )
}
