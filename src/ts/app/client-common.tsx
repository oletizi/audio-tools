import {createRoot, Root} from "react-dom/client";
import {Status} from "./components-common";
import {newClientOutput, Output} from "./output";
import {ClientConfig} from "./config-client";
import React from 'react'

export interface Result {
    error: string
    data: any
}

export interface ClientCommon {
    fetchConfig(): Promise<Result>

    saveConfig(cfg: ClientConfig): Promise<Result>

    getOutput(): Output

    status(msg: string)

    post(url: string, obj: any): Promise<Result>

    get(url: string): Promise<Result>

}

export function newClientCommon(statusId: string) {
    return new BasicClientCommon(statusId)
}

class BasicClientCommon implements ClientCommon {
    private readonly statusRoot: Root;
    private readonly terminalRoot: Root;
    private readonly out: Output

    constructor(statusId: string = 'status', terminalId: string = 'terminal') {
        this.statusRoot = createRoot(document.getElementById(statusId))
        this.terminalRoot = createRoot(document.getElementById(terminalId))
        this.out = newClientOutput()
    }

    status(msg) {
        this.statusRoot.render(<Status msg={msg ? msg : 'Unknown'}/>)
    }

    getOutput(): Output {
        return this.out
    }

    fetchConfig(): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            this.request('/config')
                .then((result) => resolve(result))
                .catch(err => reject(err))
        })
    }

    saveConfig(cfg) {
        return this.post('/config/save', cfg)
    }

    get(url) {
        return this.request(url, 'GET')
    }

    post(url, obj: any) {
        return this.request(url, 'POST', obj)
    }

    private request(url, method: string = 'GET', body: any = {}): Promise<Result> {
        const options: any = {method: method}
        if (method === 'POST') {
            options.body = JSON.stringify(body)
        }
        return new Promise<any>((resolve, reject) => {
            this.out.log(`options.body: ${options.body}`)
            fetch(url, options)
                .then((res) => {
                    let statusMessage = `${res.status}: ${res.statusText}: ${url}`;
                    this.status(statusMessage)
                    if (res.status == 200) {
                        res.json()
                            .then((body) => {
                                resolve(body)
                            })
                            .catch(err => {
                                console.error(err)
                                this.status(err.message)
                                resolve({error: err})
                            })
                    } else {
                        reject({error: statusMessage})
                    }
                })
                .catch(err => {
                    console.error(err)
                    this.status(err.message)
                    reject({error: err})
                })
        })
    }
}