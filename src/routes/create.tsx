import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ComicEditor } from "@/components/comic/ComicEditor";
import { useStore } from "@/lib/store";
import { DEMO_USER, makeChapter, newId } from "@/data/sampleJourneys";
import type { Journey } from "@/types/journey";

export const Route = createFileRoute("/create")({
  validateSearch: (s: Record<string, unknown>): { id?: string } =>
    typeof s.id === "string" ? { id: s.id } : {},
  head: () => ({
    meta: [
      { title: "Viết hành trình — Cách mà mình đã" },
      {
        name: "description",
        content: "Tạo hành trình mới với các chương, khung tranh và bong bóng thoại.",
      },
      { property: "og:title", content: "Viết hành trình" },
      { property: "og:description", content: "Trình soạn truyện tranh cho câu chuyện của bạn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreatePage,
});

function blank(): Journey {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: newId("j"),
    title: "",
    description: "",
    category: "Học kỹ năng mới",
    author: DEMO_USER.name,
    authorId: DEMO_USER.id,
    coverLabel: "",
    privacy: "private",
    status: "ongoing",
    published: false,
    createdAt: today,
    updatedAt: today,
    chapters: [makeChapter(1)],
  };
}

function CreatePage() {
  const { id } = Route.useSearch();
  const { journeys, saveJourney } = useStore();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<Journey | null>(null);

  // Wait for client mount so localStorage data is available.
  useEffect(() => {
    const found = id ? journeys.find((j) => j.id === id && j.authorId === DEMO_USER.id) : undefined;
    setInitial((cur) => (cur && cur.id === (found?.id ?? cur.id) ? cur : (found ?? blank())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, journeys.length]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary">
          <span className="font-display font-bold text-[11px] uppercase tracking-wider">
            COMIC STUDIO · CREATIVE SUITE
          </span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-primary drop-shadow-[3px_3px_0px_var(--comic-shadow)]">
          {id ? "CHỈNH SỬA TẬP TRUYỆN" : "VIẾT ORIGIN STORY MỚI"}
        </h1>
        <p className="font-sans text-sm text-muted-foreground">
          Sắp xếp từng chương theo dòng thời gian. Thêm khung tranh, lời thoại, suy nghĩ và những
          hình ảnh chân thực nhất.
        </p>
      </div>
      {initial && (
        <ComicEditor
          key={initial.id}
          initial={initial}
          onSave={(j) => {
            saveJourney(j);
            if (!id) navigate({ to: "/create", search: { id: j.id }, replace: true });
          }}
        />
      )}
    </div>
  );
}
