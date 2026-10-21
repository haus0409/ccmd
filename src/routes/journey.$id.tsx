import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Heart, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ComicPanel } from "@/components/comic/ComicPanel";
import { CoverPlaceholder, StatusBadge } from "@/components/journeys/JourneyCard";
import { useStore } from "@/lib/store";
import { DEMO_USER } from "@/data/sampleJourneys";

export const Route = createFileRoute("/journey/$id")({
  head: () => ({
    meta: [
      { title: "Đọc hành trình — Cách mà mình đã" },
      {
        name: "description",
        content: "Một hành trình cá nhân được kể bằng những chương truyện tranh.",
      },
      { property: "og:title", content: "Đọc hành trình — Cách mà mình đã" },
      { property: "og:description", content: "Một hành trình cá nhân được kể bằng truyện tranh." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const { id } = Route.useParams();
  const s = useStore();
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const j = s.journeys.find((x) => x.id === id);

  if (!j || (j.authorId !== DEMO_USER.id && (!j.published || j.privacy === "private")))
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="text-3xl font-semibold">Không tìm thấy hành trình</h1>
        <p className="mt-2 text-muted-foreground">
          Có thể câu chuyện này đã được chuyển về riêng tư.
        </p>
        <Button asChild className="mt-6">
          <Link to="/explore">Về trang khám phá</Link>
        </Button>
      </div>
    );

  const comments = s.comments.filter((c) => c.journeyId === j.id);
  const liked = s.myReactions.includes(j.id);
  const saved = s.bookmarks.includes(j.id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return setErr("Bình luận không được để trống.");
    s.addComment(j.id, text.trim());
    setText("");
    setErr("");
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[240px_1fr]">
      {/* Sidebar: Table of Contents */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="comic-box rounded-sm bg-card p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
            <span className="h-4 w-1.5 bg-primary" />
            <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">
              MỤC LỤC TẬP TRUYỆN
            </p>
          </div>
          <ol className="space-y-2 text-xs font-medium">
            {j.chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#ch-${c.id}`}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-muted-foreground transition hover:bg-secondary hover:text-primary"
                >
                  <span className="font-display font-bold text-[10px] text-primary">#{i + 1}</span>
                  <span className="truncate">{c.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {/* Main Comic Article */}
      <article className="max-w-3xl">
        {/* Issue Metadata */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-display rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
            {j.category}
          </span>
          <StatusBadge status={j.status} />
          {!j.published && (
            <span className="font-display rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
              BẢN NHÁP
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl leading-tight tracking-wide text-foreground uppercase drop-shadow-[3px_3px_0px_var(--comic-shadow)]">
          {j.title}
        </h1>

        {/* Description */}
        <p className="mt-4 font-sans text-base leading-relaxed italic text-muted-foreground">
          "{j.description}"
        </p>

        {/* Author & Action Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-border/70 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-border bg-primary font-display text-xs font-bold text-primary-foreground shadow-[2px_2px_0px_var(--comic-shadow)]">
            {j.author.slice(0, 2).toUpperCase()}
          </div>
          <div className="mr-auto text-xs">
            <p className="font-display font-bold text-foreground">{j.author}</p>
            <p className="font-sans text-[11px] text-muted-foreground">Cập nhật: {j.updatedAt}</p>
          </div>

          {/* Action buttons */}
          <button
            onClick={() => s.toggleReaction(j.id)}
            className={`comic-box font-display font-bold inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs transition-all ${
              liked
                ? "border-border bg-accent text-white shadow-[3px_3px_0px_var(--comic-shadow)]"
                : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />
            ĐỒNG CẢM · {s.reactions[j.id] ?? 0}
          </button>

          <button
            onClick={() => s.toggleBookmark(j.id)}
            className={`comic-box font-display font-bold inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-xs transition-all ${
              saved
                ? "border-border bg-primary text-primary-foreground shadow-[3px_3px_0px_var(--comic-shadow)]"
                : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
            {saved ? "ĐÃ LƯU" : "LƯU TRUYỆN"}
          </button>

          {j.authorId === DEMO_USER.id && (
            <Link
              to="/create"
              search={{ id: j.id }}
              className="comic-box font-display font-bold inline-flex items-center gap-1.5 rounded-sm bg-secondary px-3 py-2 text-xs text-foreground hover:border-primary"
            >
              <Pencil className="h-3 w-3" /> SỬA
            </Link>
          )}
        </div>

        {/* Cover Art Banner */}
        <CoverPlaceholder
          label={j.coverLabel}
          imageUrl={j.coverImage}
          className="mt-8 aspect-[16/8] rounded-sm shadow-[5px_5px_0px_var(--comic-shadow)]"
        />

        {/* Chapters and Comic Panels */}
        {j.chapters.map((c, i) => (
          <section key={c.id} id={`ch-${c.id}`} className="mt-16 scroll-mt-28">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-display rounded bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                  CHƯƠNG #{i + 1}
                </span>
                <h2 className="font-comic text-2xl sm:text-3xl uppercase tracking-wide text-foreground">
                  {c.title}
                </h2>
              </div>
              <span className="font-display text-xs text-muted-foreground">{c.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {c.panels.map((p) => (
                <ComicPanel key={p.id} panel={p} />
              ))}
            </div>
          </section>
        ))}

        {/* Comments Section */}
        <section className="mt-20 border-t-2 border-border pt-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-6 w-2 bg-primary" />
            <h2 className="font-comic text-2xl uppercase tracking-wider text-foreground">
              LỜI NHẮN ĐỒNG MINH ({comments.length})
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <textarea
              className="input-field min-h-24 font-sans text-sm"
              placeholder="Để lại lời nhắn, cảm xúc hoặc sự đồng cảm cho tác giả..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {err && <p className="font-sans text-xs text-destructive">{err}</p>}
            <button
              type="submit"
              className="comic-box font-display inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-xs font-bold tracking-wider text-primary-foreground hover:brightness-110 active:scale-95"
            >
              GỬI LỜI NHẮN
            </button>
          </form>

          <ul className="mt-8 space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="comic-box rounded-sm bg-card p-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="font-display text-sm font-bold text-primary">{c.author}</span>
                  <span className="font-sans text-[11px] text-muted-foreground">{c.createdAt}</span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">{c.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
