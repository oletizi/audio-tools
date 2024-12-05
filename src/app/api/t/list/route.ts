import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";
export async function GET(request) {
    const cfg = await newServerConfig()
    const source = await list(cfg.sourceRoot)
    const target = await list(cfg.targetRoot)
    return NextResponse.json( {data: {source: source, target: target}});
}