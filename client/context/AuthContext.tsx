"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User } from '@/types'
import { useQueryClient } from "@tanstack/react-query";


interface AuthContextValue {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName: string) => Promise<void>
    logout: () => Promise<void>
}


const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const queryClient = useQueryClient()

    const fetchME = async () => {
        try {
            const { data } = await api.get("/auth/me")
            setUser(data)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(localStorage.getItem("access_token")) 
            fetchME()
        else
            setLoading(false)

        const handleLogout = () => {
            setUser(null)
            queryClient.clear()
            router.push("/login")
        }

        window.addEventListener("auth:logout", handleLogout)
        return () => window.removeEventListener("auth:logout", handleLogout);
    }, [router])

    const login = async (email: string, password: string) => {
        const { data } = await api.post("/auth/login", {email, password})
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)
        await fetchME()
        router.push("/projects")
    }

    const register = async (email: string, password: string, fullName: string) => {
        await api.post("/auth/register", {email, password, full_name: fullName})
        await login(email, password)
    }

    const logout = async () => {
        const refreshToken = localStorage.getItem("refresh_token")
        if (refreshToken) {
            try {
                await api.post("/auth/logout", { refresh_token: refreshToken });
            } catch {

            }
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        queryClient.clear()
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}