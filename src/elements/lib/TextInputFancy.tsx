import {forwardRef, HTMLInputTypeAttribute, useState} from "react"

type TextInputAttributes = {
    type: HTMLInputTypeAttribute
    label: string
    tabIndex?: number
}

const TextInputFancy = forwardRef<HTMLInputElement, React.PropsWithChildren & TextInputAttributes>((props, ref) => {
    const [active, setActive] = useState(false)
    const [busy, setBusy] = useState("")

    const focus = () => setActive(true)
    const blur = () => setActive(false)

    const style = {
        transform: `translateY(${active || busy ? "0" : "1rem"})`,
        color: active || busy ? "var(--c3)" : "var(--c3)"
    }

    return (
        <>
            <label className="pointer-events-none relative block text-xxs transition-all duration-150 ease-in-out" style={style}>
                {props.label}
            </label>
            <input
                type={props.type}
                ref={ref}
                className="focus:border-b4 mb-3 block w-full border-b-2 border-c2 bg-transparent text-base outline-none transition-all"
                onFocus={focus}
                onBlur={blur}
                onInput={(e) => setBusy(e.currentTarget.value)}
                tabIndex={props.tabIndex}
            />
        </>
    )
})

export default TextInputFancy
