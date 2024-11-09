import {createRoot, Root} from "react-dom/client";
import {Status} from "./components-common";
import {newClientOutput, Output} from "./output";
import {ClientConfig} from "./config-client";
import React from 'react'

export interface Result {
    error: string | null
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

    async saveConfig(cfg) {
        const result = await this.post('/config/save', cfg)
        if (result.error) {
            this.out.error(result.error)
            this.status(result.error)
        } else {
            this.status(result.data.message)
        }
        return result
    }

    get(url) {
        return this.request(url, 'GET')
    }

    post(url, obj: any) {
        return this.request(url, 'POST', obj)
    }

    private async request(url, method: string = 'GET', body: any = {}): Promise<Result> {
        const options: any = {method: method}
        if (method === 'POST') {
            options.body = JSON.stringify(body)
            options.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        this.out.log(`options.body: ${options.body}`)
        let rv: Result = {error: null, data: {}}
        try {
            const res = await fetch(url, options)
            let statusMessage = `${res.status}: ${res.statusText}: ${url}`;
            if (res.status == 200) {
                try {
                    this.status(statusMessage)
                    rv = await res.json()
                } catch (err) {
                    this.status(`Error: ${err.message}`)
                    this.out.error(err)
                    rv.error = err.message
                }

            } else {
                this.status(statusMessage)
                this.out.error(statusMessage)
                rv.error = statusMessage
            }
        } catch (err) {
            console.error(err)
            this.status(err.message)
        }
        return rv
    }
}