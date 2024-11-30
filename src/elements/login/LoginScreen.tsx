import React, {forwardRef, HTMLInputTypeAttribute, useRef, useState} from "react"
import User from "../../lib/User"

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

                    <input type="checkbox" ref={typeInput} />
                    <label className="inline-block text-xs">Remember me</label>

                    <button type="submit" className="block">
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
        color: active || busy ? "var(--fg-dim)" : "var(--fg)"
    }

    return (
        <>
            <label className="pointer-events-none relative block text-xxs transition-all duration-150 ease-in-out" style={style}>
                {props.label}
            </label>
            <input
                type={props.type}
                ref={ref}
                className="mb-3 block w-full border-b-2 border-b1 bg-transparent text-sm outline-none transition-all focus:border-b2"
                onFocus={focus}
                onBlur={blur}
                onInput={(e) => setBusy(e.currentTarget.value)}
            />{" "}
        </>
    )
})
