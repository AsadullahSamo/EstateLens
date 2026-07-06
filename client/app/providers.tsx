"use client"

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
            { children }
        </QueryClientProvider>
    )
}