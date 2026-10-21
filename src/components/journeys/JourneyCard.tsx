import { Link } from "@tanstack/react-router";
import { BookOpen, Heart, Lock, Sparkles } from "lucide-react";
import { STATUS_LABEL, type Journey } from "@/types/journey";
import { useStore } from "@/lib/store";

export function CoverPlaceholder({
  label,
  imageUrl,
  className = "",
}: {
  label?: string;
  imageUrl?: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <div
        className={`relative overflow-hidden border-2 border-border bg-card/60 ${className || "aspect-[4/3]"}`}
      >
        <img
          src={imageUrl}
          alt={label || "Bìa truyện"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        {label && (
          <span className="absolute bottom-2 left-2 right-2 truncate font-display text-xs text-white/90 drop-shadow">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`placeholder-art relative flex aspect-[4/3] items-center justify-center p-4 text-center ${className}`}
    >
      <div className="space-y-1">
        <Sparkles className="mx-auto h-5 w-5 text-primary opacity-60" />
        <span className="font-display font-bold block text-[11px] tracking-wider text-muted-foreground uppercase">
          COMIC PANEL
        </span>
        {label && <em className="block font-sans text-xs text-foreground/70">{label}</em>}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: Journey["status"] }) {
  const styles = {
    ongoing: "border-primary/80 bg-primary/10 text-primary",
    completed: "border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    unresolved: "border-accent/80 bg-accent/10 text-accent",
  };

  return (
    <span
      className={`comic-badge shrink-0 whitespace-nowrap rounded px-2 py-0.5 text-[10px] font-bold tracking-wider ${styles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function JourneyCard({ journey }: { journey: Journey }) {
  const { reactions } = useStore();
  const reactionCount = reactions[journey.id] ?? 0;

  return (
    <Link
      to="/journey/$id"
      params={{ id: journey.id }}
      className="group comic-box-hover relative flex flex-col rounded-sm bg-card p-2.5 text-card-foreground"
    >
      {/* Top Issue Tag Bar - Symmetrical & Zero Wrap */}
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <span className="font-display shrink-0 rounded bg-primary px-2 py-0.5 text-[10px] font-black tracking-wider text-primary-foreground">
          VOL.{journey.chapters.length}
        </span>
        <StatusBadge status={journey.status} />
      </div>

      {/* Cover Artwork */}
      <CoverPlaceholder label={journey.coverLabel} imageUrl={journey.coverImage} />

      {/* Comic Content */}
      <div className="flex flex-1 flex-col px-1 pt-3 pb-1">
        <span className="font-display mb-1 block text-[11px] font-bold uppercase tracking-wider text-accent">
          {journey.category}
        </span>

        <h3 className="font-display line-clamp-2 text-base sm:text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-primary">
          {journey.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
          {journey.description}
        </p>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-xs">
          <span className="font-medium text-foreground/90">{journey.author}</span>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> {journey.chapters.length} chương
            </span>
            {reactionCount > 0 && (
              <span className="inline-flex items-center gap-1 text-accent font-semibold">
                <Heart className="h-3 w-3 fill-accent" /> {reactionCount}
              </span>
            )}
            {journey.privacy === "private" && <Lock className="h-3 w-3 text-primary" />}
          </div>
        </div>
      </div>
    </Link>
  );
}
