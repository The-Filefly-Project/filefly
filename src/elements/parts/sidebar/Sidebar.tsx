import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {useState} from "react"
import User from "../../../lib/User"

export default function Sidebar() {
    const [open, setOPen] = useState(false)
    const user = User.session()

    return (
        <div
            className={`sidebar z-20 h-screen w-72 border-r-1 border-c2 p-6 shadow-xl shadow-c1 transition-transform duration-200 sm:fixed sm:w-10/12 sm:bg-c1e md:w-60 ${!open && "sm:-translate-x-full"}`}
        >
            <div className="controls grid grid-cols-[1fr_1.5rem] items-center">
                <div className="user">
                    <h1 className="username text-md text-c4">{user.username}</h1>
                    <p className="role text-sm text-c3">{user.root ? "Administrator" : "User"}</p>
                </div>
                <FontAwesomeIcon
                    icon={open ? "xmark" : "bars"}
                    className={`hidden h-5 cursor-pointer rounded-md p-1.5 text-c3 transition-transform duration-200 hover:bg-c2 hover:text-c4 sm:block ${!open && "-translate-y-6 translate-x-16"} `}
                    onClick={() => setOPen(!open)}
                />
            </div>
        </div>
    )
}
