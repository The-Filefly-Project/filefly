import {useEffect, useState} from "react"
import Button from "../../ui/Button"

export default function Page404() {
    const [timer, setTimer] = useState(10)

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
            <div className="relative m-16 h-[calc(100vh-8rem)] border-1 border-c2 sm:m-8 sm:h-[calc(100vh-4rem)]">
                <h1 className="inline-block -translate-x-[1px] -translate-y-[1px] bg-c1 pb-3 pr-2 text-9xl font-semibold text-cp md:text-7xl">
                    404
                </h1>
                <p className="-translate-x-[1px] bg-c1 pb-2 leading-8 text-c3 md:text-sm">Could not find the requested page.</p>

                <div className="go-back -translate-x-[1px] bg-c1 pb-8">
                    <p className="return mb-6 md:text-sm">
                        Showing files in <span className="text-cp">{timer}</span>.
                    </p>
                    <Button onClick={() => (window.location.hash = "/")}>Main page</Button>
                </div>

                <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-c2"></div>
                <div className="absolute -bottom-1 -left-1 h-2 w-2 bg-c2"></div>
                <div className="absolute -right-1 -top-1 h-2 w-2 bg-c2"></div>
            </div>
        </div>
    )
}
