
export interface ClientConfig {
    midiInput: string;
    midiOutput: string
}

export function newNullClientConfig() {
    return {
        midiOutput: '',
        midiInput: '',
    } as ClientConfig
}