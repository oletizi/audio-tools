import React from 'react'

export function Status({msg}) {
    return (
        <div className={'card text-bg-primary p-3'}>
            <div className={'card-body'}><span className={'fw-bold'}>Status:</span> {msg}</div>
        </div>)
}