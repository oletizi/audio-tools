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

export function scale(value:number, xmin: number, xmax: number, ymin: number, ymax: number) {
    const xrange = xmax - xmin
    const yrange = ymax - ymin
    return (value - xmin) * yrange/xrange + ymin
}