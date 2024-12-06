import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";

// Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function GET(request, {params}: { params: Promise<{ path: string[] }> }) {
    const p = (await params).path
    p.shift()
    return NextResponse.json(await list((await newServerConfig()).targetRoot + '/' + p.join('/')))
}