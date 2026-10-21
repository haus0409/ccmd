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
      { name: "description", content: "Một hành trình cá nhân được kể bằng những chương truyện tranh." },
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
        <p className="mt-2 text-muted-foreground">Có thể câu chuyện này đã được chuyển về riêng tư.</p>
        <Button asChild className="mt-6"><Link to="/explore">Về trang khám phá</Link></Button>
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
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Mục lục</p>
        <ol className="space-y-2 border-l pl-4 text-sm">
          {j.chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#ch-${c.id}`} className="hover:text-accent">{i + 1}. {c.title}</a>
            </li>
          ))}
        </ol>
      </aside>
      <article className="max-w-3xl">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <span>{j.category}</span><StatusBadge status={j.status} />
          {!j.published && <span>· Bản nháp</span>}
        </div>
        <h1 className="text-4xl leading-tight font-semibold md:text-5xl">{j.title}</h1>
        <p className="mt-4 font-display text-lg italic text-muted-foreground">{j.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="placeholder-art h-10 w-10 rounded-full" />
          <div className="mr-auto text-sm"><p className="font-medium">{j.author}</p><p className="text-muted-foreground">Cập nhật {j.updatedAt}</p></div>
          <Button variant={liked ? "default" : "outline"} size="sm" onClick={() => s.toggleReaction(j.id)}>
            <Heart className={liked ? "fill-current" : ""} /> Đồng cảm · {s.reactions[j.id] ?? 0}
          </Button>
          <Button variant={saved ? "default" : "outline"} size="sm" onClick={() => s.toggleBookmark(j.id)}>
            <Bookmark className={saved ? "fill-current" : ""} /> {saved ? "Đã lưu" : "Lưu"}
          </Button>
          {j.authorId === DEMO_USER.id && (
            <Button asChild variant="ghost" size="sm"><Link to="/create" search={{ id: j.id }}><Pencil /> Sửa</Link></Button>
          )}
        </div>
        <CoverPlaceholder label={j.coverLabel} className="mt-8 aspect-[16/7]" />

        {j.chapters.map((c, i) => (
          <section key={c.id} id={`ch-${c.id}`} className="mt-16 scroll-mt-24">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Chương {i + 1} · {c.date}</p>
            <h2 className="mt-1 mb-6 text-3xl font-semibold">{c.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              {c.panels.map((p) => <ComicPanel key={p.id} panel={p} />)}
            </div>
          </section>
        ))}

        <section className="mt-20 border-t pt-10">
          <h2 className="mb-4 text-2xl font-semibold">Lời nhắn ({comments.length})</h2>
          <form onSubmit={submit} className="space-y-2">
            <textarea className="input-field min-h-20" placeholder="Để lại vài lời cho tác giả…" value={text} onChange={(e) => setText(e.target.value)} />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit">Gửi</Button>
          </form>
          <ul className="mt-6 space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="rounded-lg border bg-card p-4">
                <p className="text-sm"><span className="font-medium">{c.author}</span> <span className="text-muted-foreground">· {c.createdAt}</span></p>
                <p className="mt-1">{c.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
