import {Result} from "@/lib/lib-core";

export interface FileSpec {
    name: string
    isDirectory: boolean
}

export interface DirectorySpec extends FileSpec {
}

export interface FileSet {
    files: FileSpec[]
    directories: DirectorySpec[]
}

export interface FileSetResult extends Result {
    data: FileSet
}