import {TextField} from "@mui/material";
import {useState} from "react";

export default function IntField({
                                     onSubmit,
                                     label = "",
                                     defaultValue = 0,
                                     min = Number.MIN_SAFE_INTEGER,
                                     max = Number.MAX_SAFE_INTEGER
                                 }: {
    onSubmit: (n: number) => void,
    label: string,
    defaultValue: number,
    min: number,
    max: number
}) {
    const [value, setValue] = useState<string>(defaultValue.toString())
    const [submitted, setSubmitted] = useState<string>(value)

    function rectify(v: string) {
        const n = Number.parseInt(v)
        return ((!isNaN(n)) && n <= max && n >= min) ? n.toString() : submitted
    }

    return (<form onSubmit={(e) => {
        e.preventDefault()
        const r = rectify(e.target[0].value)
        setValue(r)
        onSubmit(Number.parseInt(r))
        setSubmitted(r)
    }}><TextField label={label} value={value} onChange={(e) => setValue(e.target.value)}/></form>)

}

export function FixedLengthTextField({label, defaultValue, length = 100, onSubmit}: {
    label: string,
    defaultValue: string,
    length: number,
    onSubmit: (name: string) => void
}) {
    const [value, setValue] = useState<string>(defaultValue)

    function rectify(v: string, length) {
        const chars = new Array(length)
        for (let i = 0; i < length; i++) {
            chars[i] = i < v.length ? v.charAt(i) : ' '
        }
        return chars.join('')
    }

    return (<form onSubmit={(e) => {
        e.preventDefault()
        const r = rectify(e.target[0].value, length)
        setValue(r)
        onSubmit(r)
    }}><TextField label={label} value={value} onChange={e => setValue(e.target.value)}/></form>)
}

