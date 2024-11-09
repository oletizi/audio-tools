
export interface ClientConfig {
    midiOutput: string
}

export function newNullClientConfig() {
    return {
        midiOutput: ''
    } as ClientConfig
}