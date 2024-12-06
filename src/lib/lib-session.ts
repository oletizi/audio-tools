import {newServerConfig} from "@/lib/config-server";
import path from "path";
import {objectFromFile} from "@/lib/lib-server";
import fs from "fs/promises";
import {NextRequest} from "next/server";
import {SESSION_COOKIE_NAME} from "@/middleware";
import {cookies} from "next/headers";

export interface SessionData {
    translate: {
        source: string[],
        target: string[]
    }
}


export async function getSessionId() {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(SESSION_COOKIE_NAME)
    return cookie ? cookie.value : ''
}

async function sessionDataFile(sessionId: string) {
    return path.join((await newServerConfig()).sessionRoot, sessionId + '.json')
}

export async function getSessionData(sessionId: string): Promise<SessionData> {
    let rv: SessionData = {translate: {source: [], target: []}}
    try {
        const result = await objectFromFile(await sessionDataFile(sessionId))
        if (result.errors.length == 0) {
            rv = result.data
        }
    } catch (e) {
    }
    return rv
}

export async function saveSessionData(sessionId: string, data: SessionData) {
    await fs.writeFile(await sessionDataFile(sessionId), JSON.stringify(data))
}