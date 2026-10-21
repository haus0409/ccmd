import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { JourneyGrid } from "@/components/journeys/JourneyGrid";
import { isVisible, useStore } from "@/lib/store";
import { CATEGORIES } from "@/types/journey";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Khám phá hành trình — Cách mà mình đã" },
      { name: "description", content: "Đọc những hành trình học hỏi, thất bại và bắt đầu lại được kể bằng truyện tranh." },
      { property: "og:title", content: "Khám phá hành trình" },
      { property: "og:description", content: "Những câu chuyện thật, kể bằng truyện tranh." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { journeys, reactions } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<"new" | "old" | "loved">("new");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = journeys
      .filter(isVisible)
      .filter((j) => !cat || j.category === cat)
      .filter((j) => !s || `${j.title} ${j.description} ${j.author}`.toLowerCase().includes(s));
    return r.sort((a, b) =>
      sort === "loved" ? (reactions[b.id] ?? 0) - (reactions[a.id] ?? 0)
        : sort === "new" ? b.updatedAt.localeCompare(a.updatedAt) : a.updatedAt.localeCompare(b.updatedAt),
    );
  }, [journeys, q, cat, sort, reactions]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-accent"}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-semibold">Khám phá hành trình</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Mỗi người có một con đường. Đọc chậm thôi, và có thể bạn sẽ thấy mình trong đó.</p>
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <input className="input-field pl-9" placeholder="Tìm theo tên, nội dung, tác giả…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="input-field md:w-48" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="new">Mới cập nhật</option>
          <option value="old">Cũ nhất</option>
          <option value="loved">Được đồng cảm nhiều</option>
        </select>
      </div>
      <div className="mt-4 mb-8 flex flex-wrap gap-2">
        <button className={chip(!cat)} onClick={() => setCat(null)}>Tất cả</button>
        {CATEGORIES.map((c) => (
          <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <JourneyGrid journeys={list} empty="Không tìm thấy hành trình nào phù hợp. Thử từ khoá khác nhé." />
    </div>
  );
}
