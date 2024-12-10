/// <reference types="../helpers.d.ts"/>
import {HashRouter, Routes, Route, Navigate} from "react-router-dom"
import LoginScreen from "./elements/pages/login/LoginScreen"
import FileExplorer from "./elements/pages/explorer/FileExplorer"
import Page404 from "./elements/pages/not-found/NotFound"
import User from "./lib/User"

export default function App() {
    const session = User.session()

    return (
        <HashRouter>
            <LoginScreen />

            {session.username && (
                <Routes>
                    <Route path="/" element={<Navigate to="/files" replace />} />
                    <Route path="/files" element={<FileExplorer />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            )}
        </HashRouter>
    )
}
