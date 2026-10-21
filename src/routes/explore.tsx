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
      {
        name: "description",
        content: "Đọc những hành trình học hỏi, thất bại và bắt đầu lại được kể bằng truyện tranh.",
      },
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
      sort === "loved"
        ? (reactions[b.id] ?? 0) - (reactions[a.id] ?? 0)
        : sort === "new"
          ? b.updatedAt.localeCompare(a.updatedAt)
          : a.updatedAt.localeCompare(b.updatedAt),
    );
  }, [journeys, q, cat, sort, reactions]);

  const chip = (active: boolean) =>
    `comic-box font-display font-bold rounded-sm px-3.5 py-1.5 text-xs tracking-wider transition-all ${
      active
        ? "border-border bg-primary font-bold text-primary-foreground shadow-[3px_3px_0px_var(--comic-shadow)]"
        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
          <span className="font-display font-bold text-[11px] uppercase tracking-wider">
            COMIC VAULT · ARCHIVES DATABASE
          </span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-primary drop-shadow-[3px_3px_0px_var(--comic-shadow)]">
          KHÁM PHÁ CÁC TẬP TRUYỆN
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Mỗi người mang trong mình một cuộc chiến. Hãy đọc chậm, chiêm nghiệm và tìm thấy sự đồng
          cảm qua từng khung tranh.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1">
          <Search className="absolute top-3 left-3.5 h-4 w-4 text-primary" />
          <input
            className="input-field pl-10"
            placeholder="Tìm theo tên tập truyện, nội dung hoặc tác giả..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select
          className="input-field md:w-56 cursor-pointer font-display font-bold text-xs"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="new">MỚI CẬP NHẬT NHẤT</option>
          <option value="old">CŨ NHẤT</option>
          <option value="loved">NHIỀU ĐỒNG CẢM NHẤT</option>
        </select>
      </div>

      {/* Category Chips */}
      <div className="mt-4 mb-10 flex flex-wrap gap-2.5">
        <button className={chip(!cat)} onClick={() => setCat(null)}>
          TẤT CẢ
        </button>
        {CATEGORIES.map((c) => (
          <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <JourneyGrid
        journeys={list}
        empty="Không tìm thấy tập truyện nào phù hợp với bộ lọc. Hãy thử tìm từ khoá khác nhé!"
      />
    </div>
  );
}
