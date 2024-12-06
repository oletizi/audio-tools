import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";
import {getSessionData, getSessionId} from "@/lib/lib-session";
import path from "path";

// Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function GET(request, {params}: { params: Promise<{ path: string[] }> }) {
    const p = (await params).path
    if (p.length == 0) {
        return NextResponse.json({message: 'Not Found', status: 404})
    }

    const location = p.shift()

    if (location !== 'source' && location !== 'target') {
        return NextResponse.json({message: 'Invalid', status: 404})
    }
    const session = await getSessionData(await getSessionId())
    let root = (await newServerConfig())[location + 'Root'];
    let dir = path.normalize(root + '/' + session.translate[location].join('/'))
    if (!dir.startsWith(root)) {
        console.error(`GET list: Invalid directory: ${dir}`)
        throw new Error('Invalid directory')
    }
    console.log(`GET list: ${dir}`)
    let result = await list(dir);
    console.log(`checking session.translate[${location}].length: ${session.translate[location].length}`)
    if (session.translate[location].length > 0) {
        // we're in a subdirectory. Add '..'
        result.data.directories.unshift({isDirectory: true, name: ".."})
    } else {
        console.log('session: ')
        console.log(session.translate[location])
    }

    return NextResponse.json(result)
}