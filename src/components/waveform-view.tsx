import {useEffect, useRef, useState} from "react";
import {Sample} from "@/model/sample";
import {scale} from "@/lib/lib-core";

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Region extends Rect {
    isActive: boolean
}

function isInRect(x: number, y: number, rect: Rect): boolean {
    return x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height;
}

export function WaveformView({sample, width, height, color = "#aaa", chops}: {
    sample: Sample,
    chops: { start: number, end: number }[]
}) {
    return <Waveform sample={sample} width={width} height={height} color={color} chops={chops}/>
}


function Waveform({sample, width, height, color, chops}: { sample: Sample, chops: { start: number, end: number }[] }) {
    const [regions, setRegions] = useState<Region[]>([])
    const [waveformData, setWaveformData] = useState<number[]>([])
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const data = sample.getSampleData()
        const mid = ctx.canvas.height / 2
        let sum = 0
        // Calculate waveform
        const chunkLength = Math.round(scale(1, 0, ctx.canvas.width, 0, data.length / sample.getChannelCount()))
        waveformData.length = 0
        for (let i = 0; i < data.length; i += sample.getChannelCount()) {
            const datum = Math.abs(data[i])
            sum += datum * datum

            if (i % (chunkLength * sample.getChannelCount()) === 0) {
                const rms = Math.sqrt(sum / chunkLength)
                const max = Math.pow(2, sample.getBitDepth()) / 2
                const rmsScaled = Math.round(scale(rms, 0, max, 0, mid))
                waveformData.push(rmsScaled)
                sum = 0
            }
        }
        setWaveformData(waveformData)
    }, [sample])

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const data = sample.getSampleData()
        const mid = ctx.canvas.height / 2

        // calculate regions
        const chopRegions = []
        if (chops) {
            for (const c of chops) {

                const startX = scale(c.start, 0, data.length / sample.getChannelCount(), 0, ctx.canvas.width)
                const endX = scale(c.start, 0, data.length / sample.getChannelCount(), 0, ctx.canvas.width)
                chopRegions.push({x: startX, y: 0, width: endX - startX, height: ctx.canvas.height, isActive: false})
            }
            setRegions(chopRegions)
        }
        paint(ctx, color, mid, waveformData, chopRegions);

    }, [sample, chops])

    return <canvas
        ref={canvasRef}
        height={height}
        width={width}
        onMouseMove={e => {

        }}/>
}


function paint(ctx, color, mid: number, waveformData: number[], chopRegions: Region[]) {
    // Clear canvas
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.strokeStyle = color
    // Draw midline
    ctx.beginPath()
    ctx.moveTo(0, mid)
    ctx.lineTo(ctx.canvas.width, mid)
    ctx.stroke()
    paintWaveform(ctx, color, waveformData, mid);

    // Draw chops
    let chopColor = "rgb(25, 118, 210)";
    paintChops(ctx, chopColor, chopRegions);
}

function paintWaveform(ctx, color: string, waveformData: number[], mid: number) {
    // Draw waveform
    ctx.strokeStyle = color
    ctx.beginPath()
    let x = 0
    for (const rms of waveformData) {
        ctx.moveTo(x, mid - rms)
        ctx.lineTo(x, mid + rms)
        x++
    }
    ctx.stroke()
}

function paintChops(ctx, chopColor: string, chopRegions: any[]) {
    ctx.strokeStyle = chopColor
    for (const r of chopRegions) {
        const startX = r.x
        const endX = r.x + r.width
        const startY = r.y
        const endY = r.y + r.height
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX, endY)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(endX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
    }
}