import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from 'axios';
import TopMenuBar from './components/layout/TopMenuBar';
import { Routes, Route } from "react-router";
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

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <SnippetProvider>
                    <TopMenuBar />
                    <Routes>
                        <Route path="/">
                            <Route index element={<Home />} />
                            <Route path={routes.home} element={<Home />} />
                            <Route path={routes.login} element={<LoginPage />} />
                            <Route path={routes.mySources} element={<Sources />} />
                            <Route path={routes.publicNets} element={<PublicNets />} />
                            <Route path={routes.editFile(':fileId')} element={<Editor />} />
                        </Route>
                    </Routes>
                </SnippetProvider>

                <ReactQueryDevtools initialIsOpen={false}/>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
