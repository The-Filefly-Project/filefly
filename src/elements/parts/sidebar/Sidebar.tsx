import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useState} from "react"
import User from "../../../lib/User"
import QuickControls from "./QuickControls"

export default function Sidebar() {
    const [open, setOpen] = useState(false)
    const user = User.session()

    return (
        <>
            <div
                className={`sidebar z-30 h-screen w-96 border-r-1 border-c2 p-6 transition-transform duration-200 sm:fixed sm:w-72 sm:bg-c1e ${!open && "sm:-translate-x-full"}`}
            >
                <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_1.5rem] items-center gap-3">
                    <QuickControls />
                    <div className="user">
                        <h1 className="username text-md truncate text-c4">{user.username}</h1>
                        <p className="role -mt-1 text-xs text-c3">{user.root ? "Administrator" : "User"}</p>
                    </div>
                    <FontAwesomeIcon
                        icon={open ? "xmark" : "bars"}
                        className={`hidden h-5 cursor-pointer rounded-md p-1.5 text-c3 transition-transform duration-200 hover:bg-c2 hover:text-c4 sm:block ${!open && "-translate-y-5 translate-x-16"} `}
                        onClick={() => setOpen(!open)}
                    />
                </div>
                <div className="secdiv-md"></div>
            </div>
            <div
                className={`sidebar-shadow fixed z-20 h-screen w-screen bg-cs backdrop-blur-md transition-opacity duration-200 ${open ? "opacity-0 sm:opacity-60" : "pointer-events-none opacity-0"}`}
                onClick={() => setOpen(false)}
            ></div>
        </>
    )
}
