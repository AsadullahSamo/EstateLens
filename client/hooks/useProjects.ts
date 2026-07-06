import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Project } from "@/types";

export function useProjects() {
    return useQuery<Project[]> ({
        queryKey: ["projects"],
        queryFn: async () => {
            const { data } = await api.get<Project []>("/projects")
            return data
        }
    })
}

export function useCreateProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (payload: {name: string, description: string}) => {
            const { data } = await api.post("/projects", payload)
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })
    })
}

export function useUpdateProject() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async( {id, payload}: {id: string, payload: {name?: string, description?: string}} ) => {
            const { data } = await api.patch(`/projects/${id}`, payload)
            return data
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] })       
    })
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/projects/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
}