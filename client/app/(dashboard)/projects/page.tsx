"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFormDialog } from "@/components/projects/ProjectFormDialog";
import { Button } from "@/components/ui/Button";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-xl text-foreground">Projects</h1>
        <Button onClick={() => setCreateOpen(true)} className="w-auto px-4 hover:cursor-pointer">
          New project
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading projects…</p>}

      {!isLoading && projects?.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-sm text-muted-foreground">No projects yet. Create your first one to get started.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <ProjectFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}