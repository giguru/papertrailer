import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from 'axios';
import TopMenuBar from './components/layout/TopMenuBar';
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Sources from "./pages/Sources";
import Editor from "./pages/Editor";

axios.defaults.baseURL = 'http://0.0.0.0/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const queryClient = new QueryClient({});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TopMenuBar />
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />
                    <Route path="my-sources" element={<Sources />} />
                    <Route path="editor" element={<Editor />} />
                </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    );
}

export default App;
