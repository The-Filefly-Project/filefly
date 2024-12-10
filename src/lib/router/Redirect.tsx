import {useEffect} from "react"
import Routing from "./Routing"

type Props = {
    from: string
    to: string
}

export default function Redirect({from, to}: Props) {
    useEffect(() => {
        Routing.router.add(from, {
            afterEnter: () => {
                window.location.hash = to
            },
            beforeExit: () => {}
        })
        return () => {
            Routing.router.remove(from)
        }
    }, [from, to])

    return <></>
}
