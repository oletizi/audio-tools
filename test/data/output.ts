import dayjs from 'dayjs'

export interface Output {
    log(msg: string | Buffer)
    write(data: string | Buffer)
}

class NodeOutput implements Output {
    private readonly debug: boolean;
    constructor(debug = true) {
        this.debug = debug
    }
    log(msg: string | Buffer) {
        if (this.debug) {
            this.write(timestamp() + ': ')
            this.write(msg)
            this.write('\n')
        }

    }
    write(msg: string | Buffer){
        process.stdout.write(msg)
    }
}

export function newNodeOutput(debug = true) {
    return new NodeOutput(debug)
}

function timestamp() {
    const d = dayjs()
    return `${d.year()}-${d.month()}-${d.day()}:${d.hour()}:${d.minute()}:${d.second()}`
}