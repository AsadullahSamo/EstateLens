import { Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { DocumentStatus } from "@/types";

const config: Record<DocumentStatus, { icon: typeof Clock; label: string }> = {
  pending: { icon: Clock, label: "Pending" },
  processing: { icon: Loader2, label: "Processing" },
  completed: { icon: CheckCircle2, label: "Completed" },
  failed: { icon: AlertCircle, label: "Failed" },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const { icon: Icon, label } = config[status];
  const isFailed = status === "failed";
  const isCompleted = status === "completed";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide ${
        isFailed ? "text-destructive" : isCompleted ? "text-success font-medium" : "text-muted-foreground"
      }`}
    >
      <Icon size={13} className={status === "processing" ? "animate-spin" : ""} />
      {label}
    </span>
  );
}