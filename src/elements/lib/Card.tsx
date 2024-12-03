import {PropsWithChildren} from "react"
import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome"

type Props = PropsWithChildren & {
    className?: string
    icon?: FontAwesomeIconProps["icon"]
    iconClass?: string
}

export default function Card(props: Props) {
    return (
        <div className={`card relative rounded-lg border-2 border-c2 p-4 ${props.className || ""}`}>
            {props.children}
            {props.icon && (
                <FontAwesomeIcon
                    icon={props.icon}
                    size="lg"
                    className={`absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 ${props.iconClass || ""}`}
                />
            )}
        </div>
    )
}
