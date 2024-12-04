import {ChangeEvent, forwardRef, useState} from "react"

interface Props {
    checked?: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement>) => any
    tabIndex?: number
    name?: string
}

const Switch = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {
    const [checked, setChecked] = useState(!!props.checked)

    const check = (e: ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) props.onChange(e)
        setChecked(e.target.checked)
    }

    return (
        <div className={`switch relative inline-block h-6 w-11 rounded-full transition-all ${checked ? "bg-c4" : "bg-c2"}`}>
            <input
                type="checkbox"
                className="absolute h-6 w-11 cursor-pointer appearance-none rounded-full"
                checked={checked}
                onChange={check}
                ref={ref}
                tabIndex={props.tabIndex}
                name={props.name}
            />
            <span
                className={`slider pointer-events-none absolute top-1 block h-4 w-4 rounded-full bg-c1 transition-all ${checked ? "left-6" : "left-1"}`}
            ></span>
        </div>
    )
})

export default Switch
