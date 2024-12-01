import React, {forwardRef, HTMLInputTypeAttribute, useRef, useState} from "react"
import User from "../../lib/User"
import Switch from "../lib/Switch"

export default function LoginScreen() {
    const nameInput = useRef<HTMLInputElement>(null)
    const passInput = useRef<HTMLInputElement>(null)
    const typeInput = useRef<HTMLInputElement>(null)

    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        if (nameInput.current && passInput.current && typeInput.current) {
            const long = typeInput.current.checked
            await User.login(nameInput.current.value, passInput.current.value, long)
        }
    }

    User.session.subscribe((session) => {
        console.log(session)
    })

    return (
        <div className="loginScreen z-1000 fixed left-0 top-0 flex h-screen w-screen justify-center">
            <div className="prompt pt-[7rem]">
                <form onSubmit={login} className="w-[14rem]">
                    <TextInput type="text" label="Username" ref={nameInput} />
                    <TextInput type="password" label="Password" ref={passInput} />

                    <div className="mt-6 flex items-center gap-4">
                        <Switch ref={typeInput} />
                        <label className="inline text-sm">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="mt-10 block w-full rounded-lg border-2 border-c2 bg-transparent px-8 py-2 text-sm transition-colors hover:bg-c2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

const TextInput = forwardRef<HTMLInputElement, React.PropsWithChildren & {type: HTMLInputTypeAttribute; label: string}>((props, ref) => {
    const [active, setActive] = useState(false)
    const [busy, setBusy] = useState("")

    const focus = () => setActive(true)
    const blur = () => setActive(false)

    const style = {
        transform: `translateY(${active || busy ? "0" : "1rem"})`,
        color: active || busy ? "var(--c3)" : "var(--c3)"
    }

    return (
        <>
            <label className="pointer-events-none relative block text-xxs transition-all duration-150 ease-in-out" style={style}>
                {props.label}
            </label>
            <input
                type={props.type}
                ref={ref}
                className="focus:border-b4 mb-3 block w-full border-b-2 border-c2 bg-transparent text-base outline-none transition-all"
                onFocus={focus}
                onBlur={blur}
                onInput={(e) => setBusy(e.currentTarget.value)}
            />
        </>
    )
})
