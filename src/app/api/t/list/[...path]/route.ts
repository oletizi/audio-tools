import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";
import {getSessionData, getSessionId} from "@/lib/lib-session";

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
    console.log(`SESSION =========`)
    console.log(session)
    let dir = (await newServerConfig())[location + 'Root'] + '/' + session.translate[location].join('/');
    console.log(`LIST ============`)
    console.log(dir)
    let result = await list(dir);
    console.log(`RESULT ==========`)
    console.log(result)
    return NextResponse.json(result)
}