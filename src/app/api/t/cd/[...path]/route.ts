import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";
import {getSessionData, getSessionId, saveSessionData} from "@/lib/lib-session";
import path from "path";
import fs from "fs/promises";

// Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function POST(request, {params}: { params: Promise<{ path: string[] }> }) {
    try {
        let p: string[] = (await params).path
        const location = p.shift()
        if (location !== 'source' && location !== 'target') {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Invalid location.')
        }

        let sessionId = await getSessionId();
        const session = await getSessionData(sessionId)
        console.log(`SESSION DATA: ========`)
        console.log(session)
        console.log(`PATH PARAMS: `)
        console.log(p)
        p = session.translate.source.concat(p)
        const normal = path.normalize(p.join('/'))
        console.log(`NORMAL: ${normal}`)

        let cfg = await newServerConfig();
        let root = location === 'source' ? cfg.sourceRoot : cfg.targetRoot;
        const absolute = path.join(root, normal)

        console.log(`ABSOLUTE: ${absolute}`)
        console.log(`Fetching status for: ${absolute}`)
        const stats = await fs.stat(absolute)
        if (stats.isDirectory()) {
            session.translate[location] = normal.split('/')
            await saveSessionData(sessionId, session)
            return NextResponse.json({message: "OK", status: 200})
        } else {
            return NextResponse.json({message: "Invalid", status: 400})
        }
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: "Not Found", status: 404})
    }

    // return NextResponse.json(await list((await newServerConfig()).sourceRoot + '/' + p.join('/')))
}