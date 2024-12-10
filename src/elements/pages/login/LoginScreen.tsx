import React, {useEffect, useRef, useState} from "react"
import User from "../../../lib/User"
import Switch from "../../ui/Switch"
import TextInputFancy from "../../ui/TextInputFancy"
import Card from "../../ui/Card"
import ClientError from "../../../lib/Error"

export default function LoginScreen() {
    const screen = useRef<HTMLDivElement>(null)
    const form = useRef<HTMLFormElement>(null)
    const [error, setError] = useState<ClientError | null>(null)
    const [errorCount, setErrorCount] = useState(0)

    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        disableForm()
        const data = new FormData(e.target as HTMLFormElement)
        const name = data.get("name") as string
        const pass = data.get("pass") as string
        const long = !!data.get("long")
        const $error = await User.login(name, pass, long)
        setError($error!)
        setErrorCount($error ? errorCount + 1 : 0)
        if ($error && error && $error.code !== error.code) setErrorCount(1)
        $error ? enableForm() : fadeOut()
    }

    useEffect(() => {
        User.renewSession().then((error) => {
            if (error) enableForm()
            else fadeOut()
        })
    }, [])

    async function disableForm() {
        form.current!.style.opacity = "0.5"
        form.current!.style.pointerEvents = "none"
    }
    async function enableForm() {
        form.current!.style.opacity = "1"
        form.current!.style.pointerEvents = "all"
    }
    async function fadeOut() {
        screen.current!.style.opacity = "0"
        screen.current!.style.pointerEvents = "none"
    }

    return (
        <div
            className="login-screen z-1000 fixed left-0 top-0 h-screen w-screen overflow-auto bg-c1 transition-opacity duration-300"
            ref={screen}
        >
            <div className="absolute left-2/4 -translate-x-2/4 pb-28 pt-28">
                <form onSubmit={login} className="pointer-events-none w-56 opacity-50 transition-opacity duration-300" ref={form}>
                    <TextInputFancy type="text" label="Username" name="name" tabIndex={1} />
                    <TextInputFancy type="password" label="Password" name="pass" tabIndex={2} />

                    <div className="mt-6 flex items-center gap-4">
                        <Switch tabIndex={3} name="long" />
                        <label className="inline text-sm">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="mt-10 block w-full rounded-lg border-2 border-c2 bg-transparent px-8 py-2 text-sm transition-colors hover:bg-c2"
                        tabIndex={4}
                    >
                        Login
                    </button>

                    {error && (
                        <Card className="mt-10" icon="warning" iconClass="text-c3" iconPosition="top-center">
                            <p className="text-center text-sm">{error.message}</p>
                            {errorCount > 1 && <span className="mt-2 block w-full text-center text-xs text-cp">({errorCount})</span>}
                        </Card>
                    )}
                </form>
            </div>
        </div>
    )
}
