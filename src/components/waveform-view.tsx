import {useEffect, useRef, useState} from "react";
import {Sample} from "@/model/sample";
import {scale} from "@/lib/lib-core";

export function WaveformView({sample, width, height, color = "#aaa", chops}: {
    sample: Sample,
    chops: { start: number, end: number }[]
}) {
    return <Waveform sample={sample} width={width} height={height} color={color} chops={chops}/>
}

function Waveform({sample, width, height, color, chops}: { sample: Sample, chops: { start: number, end: number }[] }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(0, ctx.canvas.height / 2)
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height / 2)
        ctx.stroke()
        console.log(`Color; ${color}`)
        console.log(`Sample: channel count: ${sample.getChannelCount()}`)
        const data = sample.getSampleData()

        let sum = 0
        let x = 0
        const chunkLength = Math.round(scale(1, 0, ctx.canvas.width, 0, data.length / sample.getChannelCount()))
        // console.log(`data length: ${data.length}`)
        // console.log(`per channel length: ${data.length / sample.getChannelCount()}`)
        // console.log(`chunk length: ${chunkLength}`)
        const mid = ctx.canvas.height / 2
        for (let i = 0; i < data.length; i += sample.getChannelCount()) {
            const datum = Math.abs(data[i])
            sum += datum * datum

            if (i % (chunkLength * sample.getChannelCount()) === 0) {
                const rms = Math.sqrt(sum / chunkLength)
                const max = Math.pow(2, sample.getBitDepth()) / 2
                const rmsScaled = Math.round(scale(rms, 0, max, 0, mid))
                // console.log(`bit depth : ${sample.getBitDepth()}`)
                // console.log(`max       : ${max}`)
                // console.log(`rms       :  ${rms}`)
                // console.log(`rms scaled: ${rmsScaled}`)
                // console.log(`x         : ${x}`)
                // console.log(`width     : ${ctx.canvas.width}`)
                ctx.moveTo(x, mid - rmsScaled)
                ctx.lineTo(x, mid + rmsScaled)
                sum = 0
                x++
            }
        }
        ctx.stroke()
        chops?.forEach(c => {
            ctx.strokeStyle = "blue"

            const startX = scale(c.start, 0, data.length / sample.getChannelCount(), 0, ctx.canvas.width)
            const endX = scale(c.start, 0, data.length / sample.getChannelCount(), 0, ctx.canvas.width)

            ctx.beginPath()
            ctx.moveTo(startX, 0)
            ctx.lineTo(startX, ctx.canvas.height)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(endX, 0)
            ctx.lineTo(endX, ctx.canvas.height)
            ctx.stroke()
        })

    }, [sample, chops])

    return <canvas ref={canvasRef} height={height} width={width}/>

}