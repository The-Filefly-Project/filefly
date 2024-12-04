import {PropsWithChildren} from "react"
import {FontAwesomeIcon, FontAwesomeIconProps} from "@fortawesome/react-fontawesome"

type IconPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"

type Props = PropsWithChildren & {
    className?: string
    icon?: FontAwesomeIconProps["icon"]
    iconClass?: string
    iconPosition?: IconPosition
}

const positions: Record<IconPosition, string> = {
    "top-left": "left-0 top-0 -translate-y-1/2 -translate-x-1/2",
    "top-right": "right-0 top-0 -translate-y-1/2 translate-x-1/2",
    "bottom-left": "left-0 bottom-0 translate-y-1/2 -translate-x-1/2",
    "bottom-right": "right-0 bottom-0 translate-y-1/2 translate-x-1/2",
    "top-center": "top-0 left-1/2 -translate-y-1/2 -translate-x-1/2",
    "bottom-center": "bottom-0 left-1/2 translate-y-1/2 -translate-x-1/2"
}

export default function Card(props: Props) {
    return (
        <div className={`card relative rounded-lg border-2 border-c2 p-4 ${props.className || ""}`}>
            {props.children}
            {props.icon && (
                <FontAwesomeIcon
                    icon={props.icon}
                    size="lg"
                    className={`absolute ${positions[props.iconPosition || "top-right"]} ${props.iconClass || ""}`}
                />
            )}
        </div>
    )
}
