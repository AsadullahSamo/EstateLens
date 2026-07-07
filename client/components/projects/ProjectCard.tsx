"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { Project } from "@/types";
import { useDeleteProject } from "@/hooks/useProjects";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function ProjectCard({ project }: { project: Project }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteProject = useDeleteProject();

  return (
    <Card className="p-5 relative">
      <div className="flex items-start justify-between">
        <Link href={`/projects/${project.id}`} className="flex-1">
          <h3 className="font-display font-semibold text-base text-foreground">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          )}
        </Link>
        <DropdownMenu
          trigger={
            <button className="hover:cursor-pointer text-muted-foreground hover:text-foreground px-1.5" aria-label="Project options">
              <MoreHorizontal size={20} />
            </button>
          }
        >
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>Rename</DropdownMenuItem>
          <DropdownMenuItem destructive onSelect={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project"
        message={`Delete ${project.name}. This action cannot be undone.`}
        isPending={deleteProject.isPending}
        onConfirm={() => deleteProject.mutate(project.id, {onSuccess: () => setDeleteOpen(false)})}
      />
    </Card>
  );
}