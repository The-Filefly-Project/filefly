type Props = React.PropsWithChildren<{
    className?: string
    onClick?: () => void
}>

export default function Button(props: Props) {
    return (
        <button onClick={props.onClick} className={`button rounded-lg bg-c4 px-3 py-1 text-c1 hover:bg-c4e ${props.className || ""}`}>
            {props.children}
        </button>
    )
}
