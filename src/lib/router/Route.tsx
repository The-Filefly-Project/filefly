import {PropsWithChildren, useEffect, useState} from "react"
import Routing from "./Routing"

type Props = PropsWithChildren<{
    path: string
}>

export default function Route(props: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        Routing.router.add(props.path, {
            afterEnter: () => {
                setVisible(true)
            },
            beforeExit: () => {
                setVisible(false)
            }
        })

        return () => {
            Routing.router.remove(props.path)
        }
    }, [props.path])

    return <>{visible && props.children}</>
}
