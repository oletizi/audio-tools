import {NextRequest, NextResponse} from "next/server";
import {getSessionData, getSessionId} from "@/lib/lib-session";
import path from "path";
import {newServerConfig} from "@/lib/config-server";

export async function POST(request: NextRequest) {
    try {
        const session = await getSessionData(await getSessionId())
        const cfg = await newServerConfig()

        const data = await request.json();
        const normal = path.normalize(path.join(session.translate.source.join('/'), data.path))
        return NextResponse.json({message: 'Ok', status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: `Not Found`, status: 404})
    }

}