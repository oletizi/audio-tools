import React from 'react'
import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";

export function Status({msg, variant}) {
    return (
        <SlAlert variant={variant} open closable>{msg}</SlAlert>
    )
}