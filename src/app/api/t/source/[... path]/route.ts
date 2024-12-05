import {NextResponse} from "next/server";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";

// Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

export async function GET(request) {
    const cfg = await newServerConfig()
    return NextResponse.json(await list(cfg.sourceRoot))
}