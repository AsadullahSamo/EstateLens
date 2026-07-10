import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import { Document } from "@/types"


const isInFlight = (doc: Document) => doc.status === "pending" || doc.status === "processing"

export function useDocuments(projectId: string) {
    return useQuery<Document[]>({
        queryKey: ["projects", projectId, "documents"],
        queryFn: async () => {
            const { data } = await api.get<Document[]>(`/projects/${projectId}/documents`)
            return data
        },
        enabled: !!projectId,
        refetchInterval: (query) => query.state.data?.some(isInFlight) ? 2000 : false
    })
}

export function useUploadDocument(projectId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append("file", file)
            const { data } = await api.post<Document>(`/projects/${projectId}/documents`, formData, {
                headers: {"Content-Type": "multipart/form-data"}
            })
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects", projectId, "documents"] }),
    })
}

export function useDeleteDocument(projectId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (documentId: string) => {
            await api.delete(`/projects/${projectId}/documents/${documentId}`)
        },
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["projects", projectId, "documents"]})
    })
}

export function useDownloadDocument(projectId: string) {
    return useMutation({
        mutationFn: async (documentId: string) => {
            const { data } = await api.get<{url: string}>(`/projects/${projectId}/documents/${documentId}/download-url`)
            return data.url
        }
    })
}