/// <reference types="../helpers.d.ts"/>

import LoginScreen from "./elements/pages/login/LoginScreen"
import FileExplorer from "./elements/pages/explorer/FileExplorer"
import Page404 from "./elements/pages/not-found/NotFound"
import Sidebar from "./elements/parts/sidebar/Sidebar"
import Navbar from "./elements/parts/navbar/Navbar"

import {Routes, Route, Navigate, useLocation} from "react-router"
import {useEffect} from "react"

import User from "./lib/User"

export default function App() {
    const session = User.session()
    const location = useLocation()

    useEffect(() => {
        console.log(location)
    }, [location])

    return (
        <>
            <LoginScreen />
            <div className="app-container flex sm:block">
                {session.username && (
                    <>
                        <Sidebar />
                        <div className="w-full">
                            <Navbar />
                            <Routes key={location.key} location={location.pathname}>
                                <Route path="/" element={<Navigate to="/files" replace />} />
                                <Route path="/files" element={<FileExplorer />} />
                                <Route path="*" element={<Page404 />} />
                            </Routes>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
