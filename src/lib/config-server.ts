import fs from "fs/promises";
import path from "path";
import {newServerOutput, ProcessOutput} from "@/lib/process-output";
import {ClientConfig, newClientConfig} from "@/lib/config-client";
import {objectFromFile} from "@/lib/lib-server";
import {mkdir} from "@/lib/lib-fs-server";

const DEFAULT_DATA_DIR = path.join(process.env.HOME, '.akai-sampler')
const DEFAULT_SOURCE_DIR = path.join(DEFAULT_DATA_DIR, 'source')
const DEFAULT_TARGET_DIR = path.join(DEFAULT_DATA_DIR, 'target')
const out: ProcessOutput = newServerOutput()

export interface ServerConfig {
    sourceRoot: string
    targetRoot: string
    sessionRoot: string
}

async function validate(cfg: ServerConfig) {
    return cfg && await mkdir(cfg.sourceRoot) && await mkdir(cfg.targetRoot) && await mkdir(cfg.sessionRoot)
}

export async function newServerConfig(dataDir = DEFAULT_DATA_DIR): Promise<ServerConfig> {
    const rv = {
        sourceRoot: DEFAULT_SOURCE_DIR,
        targetRoot: DEFAULT_TARGET_DIR,
        sessionRoot: path.join(dataDir, 'sessions')
    } as ServerConfig
    const configPath = path.join(dataDir, 'server-config.json')
    const storedConfig = (await objectFromFile(configPath)).data
    if (await validate(storedConfig)) {
        rv.sourceRoot = storedConfig.sourceRoot
        rv.targetRoot = storedConfig.targetRoot
    } else {
        await validate(rv)
    }
    return rv
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

export async function loadClientConfig(dataDir = DEFAULT_DATA_DIR): Promise<ClientConfig> {
    const rv: ClientConfig = newClientConfig()
    const configPath = path.join(dataDir, 'config.json');
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