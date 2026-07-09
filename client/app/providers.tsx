"use client"

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui/Toast'

export function Providers( {children}: {children: ReactNode} ) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: 2
            },
            mutations: {
                retry: 2
            }
        }
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                { children }
            </ToastProvider>
        </QueryClientProvider>
    )
}