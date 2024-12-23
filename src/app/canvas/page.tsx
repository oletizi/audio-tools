"use client"
import * as fabric from 'fabric'
import {useEffect, useRef} from "react";
import {FabricText} from "fabric";

export default function Page() {
    return <div className="container"><MyCanvas width={100} height={100}/></div>
}

export function MyCanvas({width, height}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const c = canvasRef.current;
        if (c) {
            const canvas = new fabric.Canvas(c)
            canvas.add(new FabricText('Hello!'))
            // const ctx = canvas.getContext('2d');

            // Your drawing logic here
            // ctx.fillStyle = 'green';
            // ctx.fill()
            // ctx.fillRect(0, 0, width / 2, width / 2);
        }

    }, []);

    return <canvas className="border-2" ref={canvasRef} width={width} height={height}/>;
}