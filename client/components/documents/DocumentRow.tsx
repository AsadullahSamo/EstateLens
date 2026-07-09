import { FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/documents/StatusBadge";
import { Document } from "@/types";

export function DocumentRow({ document }: { document: Document }) {
  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <FileText size={18} className="text-destructive shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{document.filename}</p>
          {document.status === "failed" && document.error_message && (
            <p className="text-xs text-destructive mt-0.5">{document.error_message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {document.page_count !== null && (
          <span className="text-xs font-mono text-muted-foreground">{document.page_count === 1 ? `${document.page_count} page` : `${document.page_count} pages`}</span>
        )}
        <StatusBadge status={document.status} />
      </div>
    </Card>
  );
}