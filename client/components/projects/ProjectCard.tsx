"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { Project } from "@/types";
import { useDeleteProject } from "@/hooks/useProjects";

export function ProjectCard({ project }: { project: Project }) {
  const [editOpen, setEditOpen] = useState(false);
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
              ⋯
            </button>
          }
        >
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>Rename</DropdownMenuItem>
          <DropdownMenuItem
            destructive
            onSelect={() => {
              if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
                deleteProject.mutate(project.id);
              }
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
      <ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
    </Card>
  );
}