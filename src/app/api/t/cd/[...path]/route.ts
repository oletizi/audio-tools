import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";
import {getSessionData, getSessionId, saveSessionData} from "@/lib/lib-session";
import path from "path";
import fs from "fs/promises";

// Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function POST(request, {params}: { params: Promise<{ path: string[] }> }) {
    let p: string[] = (await params).path
    p.shift() // the first path element should be 'root' which we only need to make the path params stuff work
    let sessionId = await getSessionId();
    const session = await getSessionData(sessionId)
    console.log(`SESSION DATA: ========`)
    console.log(session)
    console.log(`PATH PARAMS: `)
    console.log(p)
    p = session.translate.source.concat(p)
    const normal = path.normalize(p.join('/'))
    console.log(`NORMAL: ${normal}`)

    const absolute = path.join((await newServerConfig()).sourceRoot, normal)
    console.log(`ABSOLUTE: ${absolute}`)

    try {
        console.log(`Fetching status for: ${absolute}`)
        const stats = await fs.stat(absolute)
        if (stats.isDirectory()) {
            session.translate.source = normal.split('/')
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