import {useEffect, useRef, useState} from "react";
import * as fabric from "fabric";
import {Circle, FabricObject, Group, Line} from "fabric";
import {scale} from "@/lib/lib-core";

export function Knob({
                         radius = 30,
                         color = 'white',
                         backgroundColor = '#aaa',
                         strokeWidth = 2,
                         minRotation = -150,
                         maxRotation = 150,
                         min = 0,
                         max = 1,
                         defaultValue = 0,
                         step = 0,
                         onChange = () => {
                         }
                     }: {
    radius?: number,
    color?: string,
    backgroundColor?: string,
    strokeWidth?: number,
    minRotation?: number,
    maxRotation?: number,
    min?: number,
    max?: number,
    defaultValue?: number,
    step?: number,
    onChange?: (v: number) => void
}) {
    const [value, setValue] = useState(defaultValue)
    const canvasRef  = useRef<any>(null)
    const height = radius * 2
    const width = radius * 2
    const strokeColor = color
    const fillColor = backgroundColor
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = new fabric.Canvas(canvasRef.current, {selection: false})
            const indicatorX = (width - (strokeWidth * 2)) / 2
            const indicator = new Line([indicatorX, height / 3, indicatorX, 0],
                {
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    selectable: false,
                    hasControls: false
                })

            const dial = new Circle({
                left: 0 - strokeWidth,
                top: 0 - strokeWidth,
                radius: (width - strokeWidth) / 2,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fill: fillColor,
                selectable: false,
                hasControls: false
            })

            const knob = lock<Group>(new Group([dial, indicator], {
                left: 0,
                top: 0,
                hasControls: false,
                selectable: false
            }))

            canvas.add(knob)
            knob.rotate(scale(value, min, max, minRotation, maxRotation))

            let yref = 0
            let yoffset = 0
            let dragging = false
            canvas.on('mouse:down', (e) => {
                yref = e.pointer.y
                dragging = true
            })
            canvas.on('mouse:up', () => {
                dragging = false
            })
            canvas.on('mouse:move', (e) => {
                if (dragging) {
                    yoffset = yref - e.pointer.y
                    yoffset = yoffset > minRotation ? yoffset : minRotation
                    yoffset = yoffset < maxRotation ? yoffset : maxRotation

                    const v = scale(yoffset, minRotation, maxRotation, min, max);
                    const diff = Math.abs(v - value)
                    if (diff >= step) {
                        knob.rotate(yoffset)
                        canvas.renderAll()
                        const newValue = step > 0 ? Math.round(v) : v
                        setValue(newValue)
                        onChange(newValue)
                    }
                }
            })
            return () => {
                canvas.dispose().then(canvasRef.current = null)
            }
        }
    }, []);

    return (<div>
        <canvas ref={canvasRef} width={width} height={height}/>
    </div>)
}

function lock<T extends FabricObject>(o: T, b: boolean = true): T {
    o.lockMovementX = b
    o.lockMovementY = b
    o.lockScalingX = b
    o.lockScalingY = b
    return o
}