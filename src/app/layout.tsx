import React from "react";
import {Metadata} from "next";
export const metadata: Metadata = {
    title: 'Akai Sampler App',
    description: 'A set of experimental tools for the Akai S5000/S6000 series samplers.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <div id="root">{children}</div>
        </body>
        </html>
    )
}