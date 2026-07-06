"use client";

import { useState, useEffect, FormEvent } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Project } from "@/types";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  useEffect(() => {
    if (open) {
      setName(project?.name ?? "");
      setDescription(project?.description ?? "");
    }
  }, [open, project]);

  const isEditing = Boolean(project);
  const isPending = createProject.isPending || updateProject.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isEditing && project) {
      await updateProject.mutateAsync({ id: project.id, payload: { name, description } });
    } else {
      await createProject.mutateAsync({ name, description });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={isEditing ? "Rename project" : "New project"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="project-name">Name</Label>
          <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label htmlFor="project-description">Description</Label>
          <Input id="project-description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" className="w-full hover:cursor-pointer" disabled={isPending}>
          {isPending ? "Saving…" : isEditing ? "Save changes" : "Create project"}
        </Button>
      </form>
    </Dialog>
  );
}