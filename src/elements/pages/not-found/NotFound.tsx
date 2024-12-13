import {useEffect, useState} from "react"
import {motion} from "motion/react"
import Button from "../../ui/Button"

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
        <motion.div
            className="404 w-screens relative h-screen"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            key="404"
        >
            <div className="relative m-16 h-[calc(100vh-8rem)] border-1 border-c2 sm:m-8 sm:h-[calc(100vh-4rem)]">
                <h1 className="inline-block -translate-x-[1px] -translate-y-[1px] bg-c1 pb-3 pr-10 text-9xl font-semibold text-cp md:text-7xl">
                    404
                    <span className="ml-3 bg-c1 text-5xl font-semibold md:text-2xl">Woops...</span>
                </h1>

                <p className="-translate-x-[1px] bg-c1 pb-6 text-xl leading-8 text-c3 md:text-sm">
                    Resource could not be found. <br /> It could have been moved or deleted.
                </p>

                <div className="go-back -translate-x-[1px] bg-c1 pb-8">
                    <p className="return mb-6">
                        Showing files in <span className="text-cp">{timer}</span>
                    </p>
                    <Button onClick={() => (window.location.hash = "/")}>Main page</Button>
                </div>

                <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-c2"></div>
                <div className="absolute -bottom-1 -left-1 h-2 w-2 bg-c2"></div>
                <div className="absolute -right-1 -top-1 h-2 w-2 bg-c2"></div>
            </div>
        </motion.div>
    )
}
