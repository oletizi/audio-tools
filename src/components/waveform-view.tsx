import {useEffect, useRef, useState} from "react";
import {Sample} from "@/model/sample";
import {scale} from "@/lib/lib-core";
import {Canvas, Line, Polyline, XY} from "fabric"

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Region extends Rect {
    isActive: boolean
}

export function WaveformView({sample, width, height, color, chops}: {
    sample: Sample,
    chops: { start: number, end: number }[]
}) {
    const [regions, setRegions] = useState<Region[]>([])
    const [waveformData, setWaveformData] = useState<number[]>([])
    const canvasContainerRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<Canvas | null>(null)
    const waveformRef = useRef<Polyline | null>(null)

    function resizeCanvas() {
        const container = canvasContainerRef.current
        const canvas = fabricRef.current
        if (container && canvas) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            canvas.setDimensions({width: containerWidth, height: containerHeight})
            canvas.calcOffset();
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (canvas) {
            const height = canvas.clientHeight
            const width = canvas.clientWidth
            const mid = Math.round(height / 2)
            fabricRef.current = new Canvas(canvas)
            resizeCanvas()
            fabricRef.current?.add(new Line([0, mid, width, mid], {stroke: color, strokeWidth: 2}))
            paint()
        }
        return () => {
            fabricRef.current?.dispose()
        }
    }, [])

    // Calculate waveform on new sample
    useEffect(() => {
        const container = canvasContainerRef.current
        if (container) {
            const width = container.clientWidth
            const height = container.clientHeight
            // const ctx = canvas.getContext('2d')
            const data = sample.getSampleData()
            const mid = height / 2
            let sum = 0
            // Calculate waveform
            const chunkLength = Math.round(scale(1, 0, width, 0, data.length / sample.getChannelCount()))
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
            // setWaveformData(waveformData)

            // Paint waveform
            const points: XY[] = []
            let x = 0
            for (const v of waveformData) {
                points.push({x: x, y: mid + v})
                points.push({x: x, y: mid - v})
                x++
            }

            let waveform = waveformRef.current
            if (waveform) {
                fabricRef.current?.remove(waveform)
            }
            waveform = new Polyline(points, {stroke: color, strokeWidth: 1})
            waveformRef.current = waveform
            if (fabricRef.current instanceof Canvas) {
                console.log(`Adding waveform`)
                fabricRef.current.add(waveform)
            }

            fabricRef.current?.add(waveform)
            paint()
        }
    }, [sample])

    // Calculate chop regions and paint on sample or chops
    useEffect(() => {
        // const canvas = canvasRef.current
        const container = canvasContainerRef.current
        const canvas = fabricRef.current
        if (container && canvas) {
            // const ctx = canvas.getContext('2d')
            const width = container.clientWidth
            const height = container.clientHeight
            const data = sample.getSampleData()


            // calculate regions
            const chopRegions = []
            if (chops) {
                for (const c of chops) {

                    const startX = scale(c.start, 0, data.length / sample.getChannelCount(), 0, width)
                    const endX = scale(c.end, 0, data.length / sample.getChannelCount(), 0, width)
                    chopRegions.push({
                        x: startX,
                        y: 0,
                        width: endX - startX,
                        height: height,//ctx.canvas.height,
                        isActive: false
                    })
                }
                setRegions(chopRegions)
            }
            // paint(canvas, color, waveformData, chopRegions);
            paint()
        }
    }, [sample, chops])

    function paint() {
        const canvas = fabricRef.current
        if (canvas) {
            const width = canvas.width
            const height = canvas.height
            console.log(`paint()`)
            console.log(`canvas width: ${canvas.width}, height: ${canvas.height}`)
            canvas.getObjects().forEach(o => {
                console.log(`  obj: x: ${o.getX()}, y: ${o.getY()}, width: ${o.width}, height: ${o.height}`)
            })
            canvas.renderAll()
        }
    }

    return <div ref={canvasContainerRef} className="border-2">
        <canvas ref={canvasRef} height={height} width={width}/>
    </div>
}


// function paint(canvas: Canvas, color, waveformData: number[], chopRegions: Region[]) {
// Clear canvas
// canvas.clear()
// ctx.fillStyle = 'white'

// ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
// const width = canvas.width
// const height = canvas.height
// const mid = height / 2// ctx.canvas.height / 2
// ctx.strokeStyle = color

// Draw midline
// canvas.add(new Line([0, mid, width, mid], {stroke: color, strokeWidth: 2}))

// Paint waveform
// const points: XY[] = []
// let x = 0
// for (const v of waveformData) {
//     points.push({x: x, y: mid + v})
//     points.push({x: x, y: mid - v})
//     x++
// }
// const waveform = new Polyline(points)
// canvas.add(waveform)
// Draw chops
// paintChops(ctx, "rgb(25, 118, 210, .3)", chopRegions);
//
//     .renderAll()
// }

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

function paintChops(ctx, chopColor: string, chopRegions: Region[]) {
    ctx.strokeStyle = chopColor
    ctx.fillStyle = chopColor
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
        if (r.isActive) {
            ctx.fillRect(startX, startY, r.width, r.height)
        }
    }
}