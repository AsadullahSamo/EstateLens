"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useProject } from "@/hooks/useProjects";
import { useDocuments } from "@/hooks/useDocuments";
import { UploadDropzone } from "@/components/documents/UploadDropzone";
import { DocumentRow } from "@/components/documents/DocumentRow";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: documents, isLoading: documentsLoading } = useDocuments(id);

  if (projectLoading || !project) {
    return (
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <button
        onClick={() => router.push("/projects")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer w-fit"
      >
        <ArrowLeft size={16} />
        Back to projects
      </button>

      <div>
        <h1 className="font-display font-semibold text-2xl text-foreground">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>
        )}
      </div>

      <UploadDropzone projectId={id} />

      <div className="flex flex-col gap-2">
        {documentsLoading && <p className="text-sm text-muted-foreground">Loading documents…</p>}
        {!documentsLoading && documents?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">No documents uploaded yet.</p>
        )}
        {documents?.map((document) => (
          <DocumentRow key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}