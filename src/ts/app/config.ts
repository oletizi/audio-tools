import fs from "fs/promises";
import path from "path";
import {newNodeOutput} from "../../../test/data/output";

const DEFAULT_DATA_DIR = path.join(process.env.HOME, '.akai-sampler')
const out = newNodeOutput()
export interface ClientConfig {
    midiOutput: string
}

export function saveClientConfig(cfg: ClientConfig, dataDir = DEFAULT_DATA_DIR): Promise<string> {
    const configPath = path.join(dataDir, 'config.json')
    out.log(`Saving config to   : ${configPath}`)
    return new Promise((resolve, reject) => {
            ensureDataDir(dataDir)
                .then(() => fs.writeFile(configPath, JSON.stringify(cfg))
                    .then(() => resolve(configPath)))
                .catch((err) => reject(err))
                .catch((err) => reject(err))
        }
    )
}

export function newClientConfig(dataDir = DEFAULT_DATA_DIR): Promise<ClientConfig> {
    const rv = {
        midiOutput: ''
    } as ClientConfig
    let configPath = path.join(dataDir, 'config.json');

    return new Promise<ClientConfig>((resolve) => {
        out.log(`Reading config from: ${configPath}`)
        fs.readFile(configPath)
            .then(buf => {
                const storedConfig = JSON.parse(buf.toString())
                rv.midiOutput = storedConfig.midiOutput
            })
            .finally(() => resolve(rv))
    })

}

function ensureDataDir(dataDir = DEFAULT_DATA_DIR) {
    return fs.stat(dataDir)
        .then(stats => {
            if (!stats.isDirectory()) {
                throw new Error(`${dataDir} is not a directory`)
            }
        })
        .catch(err => fs.mkdir(dataDir))
}