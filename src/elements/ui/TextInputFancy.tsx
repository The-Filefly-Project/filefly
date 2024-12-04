import {forwardRef, HTMLInputTypeAttribute, useState} from "react"

type TextInputAttributes = {
    type: HTMLInputTypeAttribute
    name?: string
    label: string
    tabIndex?: number
}

const TextInputFancy = forwardRef<HTMLInputElement, React.PropsWithChildren & TextInputAttributes>((props, ref) => {
    const [active, setActive] = useState(false)
    const [busy, setBusy] = useState("")

    const focus = () => setActive(true)
    const blur = () => setActive(false)
    return (
        <>
            <label
                className={`${active || busy ? "-translate-x-[5%] scale-90" : "translate-y-4"} pointer-events-none relative block text-xxs text-c3 transition-all duration-150 ease-in-out`}
            >
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
                name={props.name}
            />
        </>
    )
})

export default TextInputFancy
