/// <reference types="../helpers.d.ts"/>
import {Routes, Route, Navigate, useLocation} from "react-router"
import LoginScreen from "./elements/pages/login/LoginScreen"
import FileExplorer from "./elements/pages/explorer/FileExplorer"
import Page404 from "./elements/pages/not-found/NotFound"
import User from "./lib/User"
import {useEffect} from "react"

export default function App() {
    const session = User.session()
    const location = useLocation()

    useEffect(() => {
        console.log(location)
    }, [location])

    return (
        <>
            <LoginScreen />
            {session.username && (
                <Routes key={location.key} location={location.pathname}>
                    <Route path="/" element={<Navigate to="/files" replace />} />
                    <Route path="/files" element={<FileExplorer />} />
                    <Route path="*" element={<Page404 />} />
                </Routes>
            )}
        </>
    )
}
