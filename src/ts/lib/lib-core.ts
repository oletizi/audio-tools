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

export function scale(value: number, xmin: number, xmax: number, ymin: number, ymax: number) {
    const xrange = xmax - xmin
    const yrange = ymax - ymin
    return (value - xmin) * yrange / xrange + ymin
}

export function real2natural(value: number, min: number, max: number) {
    return scale(value, min, max, 0, max - min)
}

export function natural2real(value: number, min: number, max: number) {
    return scale(value, 0, max - min, min, max)
}