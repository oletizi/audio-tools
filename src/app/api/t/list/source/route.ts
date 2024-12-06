import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";
import {getSessionData, getSessionId} from "@/lib/lib-session";

// Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function GET(request) {
    const session = await getSessionData(await getSessionId())
    console.log(`SESSION =========`)
    console.log(session)
    let dir = (await newServerConfig()).sourceRoot + '/' + session.translate.source.join('/');
    console.log(`LIST ============`)
    console.log(dir)
    let result = await list(dir);
    console.log(`RESULT ==========`)
    console.log(result)
    return NextResponse.json(result)
}