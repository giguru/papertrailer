import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {routes} from "../";
import {useNavigate} from "react-router";

export const tokenKey = 'authToken'

const AuthContex = createContext({
    user: null,
    isLoading: false,
    reloadUser: () => {},
    logout: false,
})


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const navigate = useNavigate()

    const saveToken = (newToken = undefined) => {
        if (newToken && newToken !== 'undefined' && newToken !== 'null') {
            setCookie(tokenKey, newToken)
        } else {
            removeCookie(tokenKey)
            setUser(null);
        }
    }

    const doToken = (useToken) => {
        if (useToken) {
            axios.defaults.headers.common['Authorization'] = 'Bearer '+useToken
            axios.get('/me', {
                data: {},
                baseURL: axios.defaults.baseURL,
                headers: {
                    'Authorization': 'Bearer '+useToken,
                    'ContentType': 'application/json',
                    'Accept': 'application/json',
                }
            })
                .then(({ data }) => {
                    setUser(data.data)
                })
                .catch((e) => {
                    if ([routes.login, routes.twoFactorChallenge].indexOf(window.location.pathname) === -1) {
                        saveToken()
                        navigate(routes.login)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const loadCurrentUser = () => {
        doToken(getCookie(tokenKey));
    }

    useEffect(() => {
        if (getCookie(tokenKey)) {
            loadCurrentUser()
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContex.Provider value={{
            user,
            saveToken,
            isLoading,
            reloadUser: loadCurrentUser,
            logout: () => saveToken(undefined),
        }}>
            {children}
        </AuthContex.Provider>
    )
}

export default function useAuth() {
    const context = useContext(AuthContex)
    return context
}

