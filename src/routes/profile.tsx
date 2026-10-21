import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { JourneyCard } from "@/components/journeys/JourneyCard";
import { JourneyGrid } from "@/components/journeys/JourneyGrid";
import { useStore } from "@/lib/store";
import { DEMO_USER } from "@/data/sampleJourneys";
import type { Journey } from "@/types/journey";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Hồ sơ của bạn — Cách mà mình đã" },
      {
        name: "description",
        content: "Hành trình đã xuất bản, bản nháp và những câu chuyện bạn đã lưu.",
      },
      { property: "og:title", content: "Hồ sơ — Cách mà mình đã" },
      { property: "og:description", content: "Những hành trình của bạn." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const s = useStore();
  const mine = s.journeys.filter((j) => j.authorId === DEMO_USER.id);
  const published = mine.filter((j) => j.published);
  const drafts = mine.filter((j) => !j.published);
  const saved = s.journeys.filter((j) => s.bookmarks.includes(j.id));

  const Owned = ({ list, empty }: { list: Journey[]; empty: string }) =>
    list.length === 0 ? (
      <div className="comic-box rounded-sm bg-card p-8 text-center text-xs font-sans text-muted-foreground">
        {empty}
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((j) => (
          <div key={j.id} className="space-y-2">
            <JourneyCard journey={j} />
            <div className="flex gap-1.5 pt-1">
              <Link
                to="/create"
                search={{ id: j.id }}
                className="comic-box font-display flex-1 rounded-sm bg-secondary py-1.5 text-center text-[10px] font-bold text-foreground hover:border-primary"
              >
                SỬA
              </Link>
              <button
                className="comic-box font-display flex-1 rounded-sm bg-card py-1.5 text-center text-[10px] font-bold text-foreground hover:border-primary"
                onClick={() => s.togglePublished(j.id)}
              >
                {j.published ? "GỠ XUẤT BẢN" : "XUẤT BẢN"}
              </button>
              <button
                className="comic-box font-display rounded-sm bg-destructive/10 px-2.5 py-1.5 text-[10px] font-bold text-destructive hover:bg-destructive hover:text-white"
                onClick={() =>
                  confirm(`Xoá tập truyện "${j.title}"? Thao tác không thể hoàn tác.`) &&
                  s.deleteJourney(j.id)
                }
              >
                XOÁ
              </button>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-5 py-12">
      {/* Profile Header */}
      <header className="comic-box flex flex-col items-start gap-6 rounded-sm bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-sm border-2 border-border bg-primary font-display text-3xl font-black text-primary-foreground shadow-[3px_3px_0px_var(--comic-shadow)]">
          MA
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-wider text-primary drop-shadow-[2px_2px_0px_var(--comic-shadow)]">
              {DEMO_USER.name}
            </h1>
            <span className="font-display rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold tracking-wider text-accent">
              VIGILANTE CREATOR
            </span>
          </div>
          <p className="font-sans text-sm italic text-muted-foreground">"{DEMO_USER.bio}"</p>
        </div>
        <Link
          to="/create"
          className="comic-box font-display inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs font-bold tracking-wider text-primary-foreground hover:brightness-110 active:scale-95"
        >
          + TẠO TRUYỆN MỚI
        </Link>
      </header>

      {/* Sections */}
      <section>
        <div className="mb-4 flex items-center gap-2.5 border-b-2 border-border pb-2">
          <span className="h-5 w-2 bg-primary" />
          <h2 className="font-comic text-2xl uppercase tracking-wider text-foreground">
            ĐÃ XUẤT BẢN ({published.length})
          </h2>
        </div>
        <Owned list={published} empty="Bạn chưa xuất bản tập truyện nào ra công chúng." />
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2.5 border-b-2 border-border pb-2">
          <span className="h-5 w-2 bg-accent" />
          <h2 className="font-comic text-2xl uppercase tracking-wider text-foreground">
            BẢN NHÁP CỦA BẠN ({drafts.length})
          </h2>
        </div>
        <Owned list={drafts} empty="Không có bản nháp nào đang dở dang." />
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2.5 border-b-2 border-border pb-2">
          <span className="h-5 w-2 bg-cyan-400" />
          <h2 className="font-comic text-2xl uppercase tracking-wider text-foreground">
            BỘ SƯU TẬP ĐÃ LƯU ({saved.length})
          </h2>
        </div>
        <JourneyGrid journeys={saved} empty="Bạn chưa lưu tập truyện nào vào bộ sưu tập." />
      </section>
    </div>
  );
}
