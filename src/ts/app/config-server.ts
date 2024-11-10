import fs from "fs/promises";
import path from "path";
import {newServerOutput} from "./output";
import {ClientConfig, newNullClientConfig} from "./config-client";

const DEFAULT_DATA_DIR = path.join(process.env.HOME, '.akai-sampler')
const out = newServerOutput()

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

export async function newClientConfig(dataDir = DEFAULT_DATA_DIR): Promise<ClientConfig> {
    const rv: ClientConfig = newNullClientConfig()
    let configPath = path.join(dataDir, 'config.json');
    let storedConfig = null
    try {
        out.log(`Reading config from: ${configPath}`)
        storedConfig = JSON.parse((await fs.readFile(configPath)).toString())
        rv.midiOutput = storedConfig.midiOutput
        rv.midiInput = storedConfig.midiInput
    } catch (err) {
        out.log(`Error reading config from: ${configPath}: ${err.message}`)
    }
    return rv
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