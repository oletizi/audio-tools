export namespace brain {
    export interface FromList {
        entries: string[]
    }
    export class Brain {

        getFromList() : FromList {
            return {
                entries: ['first entry', 'second entry', 'third entry']
            } as FromList
        }
    }
}