import dayjs from "dayjs";

export function timestamp() {
    const d = dayjs()
    return `${d.year()}-${d.month()}-${d.day()}:${d.hour()}:${d.minute()}:${d.second()}`
}

/**
 * The data and possible errors from an operation (e.g., http requests or midi sysex)
 */
export interface Result {
    error: string | null
    data: any
}

export interface MutableNumber {
    min: number
    max: number
    step: number
    mutator: (value: number) => Promise<Result>
    value: number
}

export interface MutableString {
    mutator: (value: string) => Promise<Result>
    value: string
}

export function scale(value: number | string, xmin: number | string, xmax: number | string, ymin: number | string, ymax: number | string) {
    const xrange = Number(xmax) - Number(xmin)
    const yrange = Number(ymax) - Number(ymin)
    return (Number(value) - Number(xmin)) * yrange / xrange + Number(ymin)
}

export function real2natural(value: number | string, min: number | string, max: number | string) {
    return scale(Number(value), Number(min), Number(max), 0, Number(max) - Number(min))
}

export function natural2real(value: number | string, min: number | string, max: number | string) {
    return scale(Number(value), 0, Number(max) - Number(min), Number(min), Number(max))
}