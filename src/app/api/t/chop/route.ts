import {NextRequest, NextResponse} from "next/server";
import {getSessionData, getSessionId} from "@/lib/lib-session";
import path from "path";
import {newServerConfig} from "@/lib/config-server";
import {chop} from "@/lib/lib-translate-s3k";
import {AkaiToolsConfig} from "@/akaitools/akaitools";

export async function POST(request: NextRequest) {
    try {
        const session = await getSessionData(await getSessionId())
        const cfg = await newServerConfig()

        const data = await request.json();
        if (! data.samplesPerBeat) {
            throw new Error('Samples per beat undefined.')
        }
        if (!data.beatsPerChop) {
            throw new Error('Beats per chop undefined.')
        }
        if (!data.prefix) {
            throw new Error('Prefix undefined')
        }

        const normal = path.normalize(path.join(session.translate.source.join('/'), data.path))
        const absolute = path.normalize(path.join(cfg.sourceRoot, normal))
        if (!absolute.startsWith(cfg.sourceRoot)) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Source path is outside source root.')
        }

        const target = path.normalize(path.join(cfg.s3k, data.prefix))
        if (! target.startsWith(cfg.targetRoot)) {
            throw new Error('TargetPath is outside target root.')
        }

        const akaiToolsConfig: AkaiToolsConfig = {akaiToolsPath: cfg.akaiTools, diskFile: cfg.akaiDisk}
        const result = await chop(akaiToolsConfig, absolute, target, data.prefix, data.samplesPerBeat, data.beatsPerChop)

        return NextResponse.json({
            errors: result.errors,
            message: result.errors.length === 0 ? 'Ok' : "Error",
            status: result.errors.length === 0 ? 200 : 500,
            normal: normal,
            absolute: absolute,
            prefix: data.prefix,
            samplesPerBeat: data.samplesPerBeat,
            beatsPerChop: data.beatsPerChop
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json({message: `Not Found`, status: 404})
    }

}