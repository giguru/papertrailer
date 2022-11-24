import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from 'axios';
import './sass/global.scss';
import {createTheme, ThemeProvider} from "@mui/material";
import { Routes, Route } from "react-router";
import TopMenuBar from './components/layout/TopMenuBar';
import Home from "./pages/Home";
import MyFiles from "./pages/MyFiles";
import Editor from "./pages/Editor";
import SnippetProvider from "./components/snippets/SnippetProvider";
import {routes} from "./utils/routes";
import PublicNets from "./pages/PublicNets";
import AuthProvider from "./components/auth-provider/AuthProvider";
import LoginPage from "./pages/LoginPage";

axios.defaults.baseURL = 'http://0.0.0.0/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const queryClient = new QueryClient({});

const colors = {
    emerald: {
        400: 'rgb(52 211 153)',
        500: 'rgb(16 185 129)',
        600: 'rgb(5 150 105)',
    },
    rose: {
        50: 'rgb(255 241 242)',
        100: 'rgb(255 228 230)',
        200: 'rgb(254 205 211)',
        300: 'rgb(253 164 175)',
        400: 'rgb(251 113 133)',
        500: 'rgb(244 63 94)',
        600: 'rgb(225 29 72)',
        700: 'rgb(190 18 60)',
        800: 'rgb(159 18 57)',
        900: 'rgb(136 19 55)',
    },
}
const theme = createTheme({
    typography: {
        body1: {
            lineHeight: 3,
        },
    },
    palette: {
        error: {
            main: colors.rose[600],
            dark: colors.rose[900],
            light: colors.rose[400],
            contrastText: '#fff',
        },
        primary: colors.emerald,
    },
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                root: {
                    // Some CSS
                    fontSize: '1rem',
                    textTransform: 'none',
                },
                outlined: {
                    borderWidth: '1px',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    color: '#aaaaaa',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff',
                }
            },
        }
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <SnippetProvider>
                        <TopMenuBar />
                        <Routes>
                            <Route path="/">
                                <Route index element={<Home />} />
                                <Route path={routes.home} element={<Home />} />
                                <Route path={routes.login} element={<LoginPage />} />
                                <Route path={routes.myFiles} element={<MyFiles />} />
                                <Route path={routes.publicNets} element={<PublicNets />} />
                                <Route path={routes.editFile(':fileId')} element={<Editor />} />
                            </Route>
                        </Routes>
                    </SnippetProvider>

                    <ReactQueryDevtools initialIsOpen={false}/>
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
