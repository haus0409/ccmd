import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { STATUS_LABEL, type Journey } from "@/types/journey";

export function CoverPlaceholder({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`placeholder-art flex aspect-[4/3] items-center justify-center rounded-lg p-4 text-center ${className}`}>
      <span className="text-xs text-muted-foreground">
        Ảnh bìa sẽ được thêm sau
        {label && <em className="mt-1 block opacity-80">{label}</em>}
      </span>
    </div>
  );
}

export function StatusBadge({ status }: { status: Journey["status"] }) {
  return (
    <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[11px] font-medium text-accent">
      {STATUS_LABEL[status]}
    </span>
  );
}

export function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Link
      to="/journey/$id"
      params={{ id: journey.id }}
      className="group flex flex-col rounded-xl border bg-card p-3 shadow-soft transition hover:-translate-y-0.5"
    >
      <CoverPlaceholder label={journey.coverLabel} />
      <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <span>{journey.category}</span>
          <StatusBadge status={journey.status} />
          {journey.privacy === "private" && <Lock className="h-3 w-3" />}
          {!journey.published && <span className="normal-case">· Bản nháp</span>}
        </div>
        <h3 className="text-lg leading-snug font-semibold group-hover:text-secondary">{journey.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{journey.description}</p>
        <p className="mt-4 text-sm">bởi <span className="font-medium">{journey.author}</span></p>
      </div>
    </Link>
  );
}
