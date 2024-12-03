import React, {useRef} from "react"
import User from "../../lib/User"
import Switch from "../lib/Switch"
import TextInputFancy from "../lib/TextInputFancy"
import Card from "../lib/Card"

export default function LoginScreen() {
    const nameInput = useRef<HTMLInputElement>(null)
    const passInput = useRef<HTMLInputElement>(null)
    const typeInput = useRef<HTMLInputElement>(null)

    const [error, setError] = React.useState<ReturnSA<typeof User.login> | null>(null)
    const [errorCount, setErrorCount] = React.useState(0)

    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        if (nameInput.current && passInput.current && typeInput.current) {
            const long = typeInput.current.checked
            const currentError = await User.login(nameInput.current.value, passInput.current.value, long)
            setError(currentError)
            setErrorCount(currentError ? errorCount + 1 : 0)
            if (currentError && error && currentError.code !== error.code) setErrorCount(1)
        }
    }

    User.session.subscribe((session) => {
        console.log(session)
    })

    return (
        <div className="loginScreen z-1000 fixed left-0 top-0 h-screen w-screen overflow-auto">
            <div className="absolute left-2/4 -translate-x-2/4 pb-28 pt-28">
                <form onSubmit={login} className="w-[14rem]">
                    <TextInputFancy type="text" label="Username" ref={nameInput} tabIndex={1} />
                    <TextInputFancy type="password" label="Password" ref={passInput} tabIndex={2} />

                    <div className="mt-6 flex items-center gap-4">
                        <Switch ref={typeInput} tabIndex={3} />
                        <label className={`inline text-sm ${typeInput}`}>Remember me</label>
                    </div>

                    <button
                        type="submit"
                        className="mt-10 block w-full rounded-lg border-2 border-c2 bg-transparent px-8 py-2 text-sm transition-colors hover:bg-c2"
                        tabIndex={4}
                    >
                        Login
                    </button>

                    {error && (
                        <Card className="mt-10" icon="warning" iconClass="text-c3">
                            <p className="text-center text-sm">{error.message}</p>
                            {errorCount > 1 && <span className="mt-2 block w-full text-center text-xs text-cp">(x{errorCount})</span>}
                        </Card>
                    )}
                </form>
            </div>
        </div>
    )
}
