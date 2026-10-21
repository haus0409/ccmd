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
      { name: "description", content: "Hành trình đã xuất bản, bản nháp và những câu chuyện bạn đã lưu." },
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
      <div className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">{empty}</div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((j) => (
          <div key={j.id} className="space-y-2">
            <JourneyCard journey={j} />
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/create" search={{ id: j.id }}>Sửa</Link></Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => s.togglePublished(j.id)}>
                {j.published ? "Gỡ xuất bản" : "Xuất bản"}
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive"
                onClick={() => confirm(`Xoá "${j.title}"? Không thể hoàn tác.`) && s.deleteJourney(j.id)}>Xoá</Button>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-5 py-14">
      <header className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="placeholder-art flex h-24 w-24 items-center justify-center rounded-full text-[10px] text-muted-foreground">Ảnh đại diện</div>
        <div className="flex-1">
          <h1 className="text-4xl font-semibold">{DEMO_USER.name}</h1>
          <p className="mt-2 font-display italic text-muted-foreground">{DEMO_USER.bio}</p>
        </div>
        <Button asChild><Link to="/create">Viết hành trình mới</Link></Button>
      </header>
      <section><h2 className="mb-5 text-2xl font-semibold">Đã xuất bản</h2><Owned list={published} empty="Bạn chưa xuất bản hành trình nào." /></section>
      <section><h2 className="mb-5 text-2xl font-semibold">Bản nháp</h2><Owned list={drafts} empty="Không có bản nháp." /></section>
      <section><h2 className="mb-5 text-2xl font-semibold">Đã lưu</h2><JourneyGrid journeys={saved} empty="Bạn chưa lưu hành trình nào." /></section>
    </div>
  );
}
