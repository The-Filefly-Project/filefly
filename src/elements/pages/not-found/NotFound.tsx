import {useEffect, useState} from "react"

export default function Page404() {
    const [timer, setTimer] = useState(5)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((timer) => timer - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (timer === 0) window.location.hash = "/files"
    }, [timer])

    return (
        <div className="404 w-screens relative h-screen">
            <div className="absolute left-1/2 -translate-x-1/2 transform pt-32">
                <h1 className="text-9xl text-cp">404</h1>
                <h2 className="text-1xl text-center text-c3">Page not found.</h2>
                <p className="text-center text-c3">
                    You will be redirected in <span>{timer}</span>s
                </p>
            </div>
        </div>
    )
}
