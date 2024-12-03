import {PropsWithChildren} from "react"

type Props = PropsWithChildren & {
    className?: string
}

export default function Card(props: Props) {
    return <div className={`card rounded-lg border-2 border-c2 p-4 ${props.className || ""}`}>{props.children}</div>
}
