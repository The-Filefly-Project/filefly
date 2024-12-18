/// <reference types="../helpers.d.ts"/>

import LoginScreen from "./view/login/LoginScreen"
import Home from "./view/home/Home"
import Sidebar from "./view/sidebar/Sidebar"

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
            <div className="flex sm:block">
                {session.username && (
                    <>
                        <Sidebar />
                        <div className="w-full">
                            <Routes key={location.key} location={location.pathname}>
                                <Route path="/" element={<Navigate to="/files" replace />} />
                                <Route path="/files" element={<Home />} />
                            </Routes>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
