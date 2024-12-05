import {Result} from "@/lib/lib-core";

export interface File {
    name: string
}

export interface Directory extends File {
}

export interface FileSet {
    files: File[]
    directories: Directory[]
}

export interface FileSetResult extends Result {
    data: FileSet
}