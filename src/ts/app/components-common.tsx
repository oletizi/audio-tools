import React from 'react'
import SlCard from "@shoelace-style/shoelace/dist/react/card/index.js";

export function Status({msg}) {
    return (
        <SlCard><span className={'fw-bold'}>Status:</span> <span className={'monospace'}>{msg}</span></SlCard>
    )
}