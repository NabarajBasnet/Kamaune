import React from 'react'
type SonnerToasterProps = {
    children: React.ReactNode
}
import { Toaster } from "@/components/ui/sonner"

export default function SonnerToastProvider({ children }: SonnerToasterProps) {
    return (
        <div>
            <main>{children}</main>
            <Toaster />
        </div>
    )
}