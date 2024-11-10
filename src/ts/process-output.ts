import dayjs from 'dayjs'

export interface ProcessOutput {
    log(msg: string | Buffer)

    error(msg: string | Error)

    write(data: string | Buffer)
}

class BasicOutput implements ProcessOutput {
    private readonly debug: boolean;

    private readonly writeFunction: Function
    private readonly errorFunction: Function;
    private readonly newline: string;

    constructor(writeFunction, errorFunction, newline = '\n', debug = true) {
        this.newline = newline
        this.writeFunction = writeFunction
        this.errorFunction = errorFunction
        this.debug = debug
    }

    write(msg: string | Buffer) {
        this.writeFunction(msg)
    }

    error(msg: string | Error) {
        this.errorFunction(msg)
    }

    log(msg: string | Buffer) {
        if (this.debug) {
            this.writeFunction(timestamp() + ': ' + msg + this.newline)
        }
    }
}

export function newServerOutput(debug = true) : ProcessOutput {
    return new BasicOutput((msg) => process.stdout.write(msg), (msg) => process.stderr.write(msg),'\n', debug)
}

export function newClientOutput(debug = true) : ProcessOutput {
    return new BasicOutput(console.info, console.error, '', debug)
}

function timestamp() {
    const d = dayjs()
    return `${d.year()}-${d.month()}-${d.day()}:${d.hour()}:${d.minute()}:${d.second()}`
}