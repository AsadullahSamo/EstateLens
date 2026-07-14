"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useUploadDocument } from "@/hooks/useDocuments";
import { useToast } from "../ui/Toast";

export function UploadDropzone({ projectId }: { projectId: string }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadDocument(projectId);
  const { showToast } = useToast()

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      Array.from(files).forEach((file) => {
        if (file.type !== "application/pdf") {
          showToast(`Only PDF files are supported.`);
          return;
        }
        setUploadingCount(c => c + 1)
        upload.mutate(file, {onSettled: () => setUploadingCount(c => c - 1)});
      });
    },
    [upload, showToast]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={`border border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border bg-input-bg"
      }`}
    >
      <Upload size={20} className="text-muted-foreground" />
      <p className="text-sm text-foreground">
        <span className="font-medium">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">PDF only</p>
      {uploadingCount > 0 && (
        <p className="text-xs text-muted-foreground animate-pulse">
          Uploading {uploadingCount} file{uploadingCount > 1 ? "s" : ""}…
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}