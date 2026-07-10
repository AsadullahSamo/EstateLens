"use client";

import { useState } from "react";
import { FileText, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { useDeleteDocument, useDownloadDocument } from "@/hooks/useDocuments";
import { useToast } from "@/components/ui/Toast";
import { Document } from "@/types";

export function DocumentRow({ document }: { document: Document }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteDocument = useDeleteDocument(document.project_id);
  const downloadDocument = useDownloadDocument(document.project_id);
  const { showToast } = useToast();

  const handleDownload = () => {
    downloadDocument.mutate(document.id, {
      onSuccess: (url) => window.open(url, "_blank"),
      onError: () => showToast("Couldn't get download link. Try again."),
    });
  };

  const handleDelete = () => {
    deleteDocument.mutate(document.id, {
      onSuccess: () => setDeleteOpen(false),
      onError: () => showToast("Couldn't delete document. Try again")
    })
  }

  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <FileText size={18} className="text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{document.filename}</p>
          {document.status === "failed" && document.error_message && (
            <p className="text-xs text-destructive mt-0.5">{document.error_message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {document.page_count !== null && (
          <span className="text-xs font-mono text-muted-foreground">{document.page_count} pages</span>
        )}
        <StatusBadge status={document.status} />
        <button
          onClick={handleDownload}
          disabled={document.status === "failed" || downloadDocument.isPending}
          className="text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Download document"
        >
          <Download size={16} />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="text-muted-foreground hover:text-destructive cursor-pointer"
          aria-label="Delete document"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete document"
        message={`Delete ${document.filename}. This action cannot be undone.`}
        isPending={deleteDocument.isPending}
        onConfirm={handleDelete}
      />
    </Card>
  );
}