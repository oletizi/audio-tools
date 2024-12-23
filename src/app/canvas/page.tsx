"use client"
import * as fabric from 'fabric'
import {useEffect, useRef} from "react";
import {Circle, FabricObject, Group, Line} from "fabric";

export default function Page() {
    return <div className="container"><Knob fillColor="black" strokeColor="white"
                                            strokeWidth={3}/></div>
}

export function Knob({radius = 30, fillColor = "white", strokeColor = "black", strokeWidth = 2}: {
    radius?: number,
    fillColor?: string,
    strokeColor?: string,
    strokeWidth?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const height = radius * 2
    const width = radius * 2
    useEffect(() => {
        const c = canvasRef.current;
        if (c) {
            const canvas = new fabric.Canvas(c, {selection: false})
            const indicator = new Line([width / 2, height / 3, width / 2, 0],
                {
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    selectable: false,
                    hasControls: false
                })

            const dial = new Circle({
                left: 0,
                top: 0,
                radius: (width - strokeWidth) / 2,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                fill: fillColor,
                selectable: false,
                hasControls: false
            });
            const knob = lock<Group>(new Group([dial, indicator], {hasControls: false, selectable: false}))
            // unlock(indicator)
            // unlock(dial)
            canvas.add(knob)

            let yref = 0
            let yoffset = 0
            let dragging = false
            canvas.on('mouse:down', (e) => {
                yref = e.pointer.y
                dragging = true
            })
            canvas.on('mouse:up', (e) => {
                dragging = false
            })
            canvas.on('mouse:move', (e) => {
                if (dragging) {
                    yoffset = yref - e.pointer.y
                    knob.rotate(yoffset)
                    canvas.renderAll()
                }
            })
        }

    }, []);

    return <canvas ref={canvasRef} width={width} height={height}/>;
}

function unlock<T extends FabricObject>(o: T): T {
    return lock(o, false)
}

function lock<T extends FabricObject>(o: T, b: boolean = true): T {
    o.lockMovementX = b
    o.lockMovementY = b
    // o.lockRotation = b
    o.lockScalingX = b
    o.lockScalingY = b
    return o
}