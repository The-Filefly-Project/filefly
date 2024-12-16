import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome"
import {PropsWithChildren, useEffect, useRef, useState} from "react"
import {AnimatePresence, motion} from "motion/react"

export default function QuickControls() {
    const [open, setOpen] = useState(false)
    const avatar = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const blur = (e: MouseEvent) => e.target !== avatar.current && setOpen(false)
        window.addEventListener("click", blur)
        return () => window.removeEventListener("click", blur)
    }, [])

    return (
        <div className="relative">
            <img
                src="/api/v1/account/avatar"
                alt="avatar"
                className="h-9 w-9 cursor-pointer rounded-full bg-c2"
                ref={avatar}
                onClick={() => setOpen(true)}
            />
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="avatar-menu"
                        initial={{opacity: 0, translateY: -15}}
                        animate={{opacity: 1, translateY: 0}}
                        exit={{opacity: 0, translateY: -15}}
                        className="dropdown absolute left-0 top-14 w-60 rounded-md border-1 border-c2 bg-c1 p-3 shadow-md"
                    >
                        <span className="absolute left-2 top-0 block size-3 -translate-y-[54%] rotate-45 rounded-tl-sm border-l-1 border-t-1 border-c2 bg-c1"></span>
                        <ListItem>Profile</ListItem>
                        <ListItem>Settings</ListItem>
                        <ListItem>Theme</ListItem>
                        <div className="secdiv-sm"></div>
                        <ListItem>Sign out</ListItem>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

type ItemProps = PropsWithChildren<{
    icon?: FontAwesomeIconProps["icon"]
    disabled?: boolean
}>

const ListItem = (props: ItemProps) => (
    <p
        className={`cursor-pointer rounded-md p-1 px-2 py-1.5 text-sm transition-colors duration-100 hover:bg-c2 ${props.disabled && "pointer-events-none opacity-30"}`}
    >
        {props.icon && <FontAwesomeIcon icon={props.icon} className="mr-3 w-4 text-c4" />}
        {props.children}
    </p>
)
