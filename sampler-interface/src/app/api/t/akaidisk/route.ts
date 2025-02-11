import {NextRequest, NextResponse} from "next/server";
import {newAkaiToolsConfig, readAkaiDisk} from "@oletizi/sampler-devices"
import fs from "fs/promises";
import {AkaiToolsConfig} from "@/model/akai";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json(await readAkaiDisk(await newAkaiToolsConfig()))
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: `Not Found`, status: 404})
    }

}