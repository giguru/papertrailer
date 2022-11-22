import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from 'axios';
import {createTheme, ThemeProvider} from "@mui/material";
import { Routes, Route } from "react-router";
import TopMenuBar from './components/layout/TopMenuBar';
import Home from "./pages/Home";
import Sources from "./pages/Sources";
import Editor from "./pages/Editor";
import SnippetProvider from "./components/snippets/SnippetProvider";
import {routes} from "./utils/routes";
import PublicNets from "./pages/PublicNets";
import AuthProvider from "./components/auth-provider/AuthProvider";
import LoginPage from "./pages/LoginPage";

axios.defaults.baseURL = 'http://0.0.0.0/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const queryClient = new QueryClient({});
const theme = createTheme({
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                root: {
                    // Some CSS
                    fontSize: '1rem',
                    textTransform: 'none',
                },
                outlinedPrimary: {
                    color: 'rgb(5 150 105)',
                    borderColor: 'rgb(5 150 105)',
                },
                containedPrimary: {
                    // color: 'rgb(5 150 105)',
                    backgroundColor: 'rgb(16 185 129)',
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
                                <Route path={routes.myFiles} element={<Sources />} />
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
