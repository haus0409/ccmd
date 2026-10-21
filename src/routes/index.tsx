import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, PenTool, Sparkles, Zap } from "lucide-react";
import { HeroComicStage } from "@/components/comic/HeroComicStage";
import { JourneyGrid } from "@/components/journeys/JourneyGrid";
import { isVisible, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cách mà mình đã — Pixel Comic Archives" },
      {
        name: "description",
        content:
          "Kể lại những lần vấp ngã, chạm đáy và tái sinh qua lăng kính truyện tranh pixel & dark superhero.",
      },
      { property: "og:title", content: "Cách mà mình đã — Pixel Comic Archives" },
      {
        property: "og:description",
        content: "Mỗi con người là một nhân vật truyện tranh với hành trình riêng.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { journeys } = useStore();
  const featured = journeys.filter(isVisible).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 md:py-12">
      {/* Hero Section */}
      <section className="grid items-center gap-8 lg:gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          {/* Top Issue Tag */}
          <div>
            <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs text-primary">
              <Zap className="h-3.5 w-3.5 animate-pulse text-primary" />
              <span className="font-display font-bold text-[11px] tracking-wider uppercase">
                ARCHIVES #2026 · REAL ORIGIN STORIES
              </span>
            </div>
          </div>

          {/* Main Title Block - Zero Collision & Guaranteed Single Line */}
          <div className="space-y-2.5 pt-1">
            <p className="font-display font-bold text-xs sm:text-sm tracking-widest text-accent uppercase">
              EVERY HERO HAS A DARK PAST...
            </p>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[3.15rem] leading-[1.25] tracking-tight text-primary drop-shadow-[4px_4px_0px_var(--comic-shadow)] uppercase whitespace-nowrap">
              CÁCH MÀ MÌNH ĐÃ
            </h1>
          </div>

          {/* Description */}
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            …học một điều mới, đối diện thất bại, đi qua giai đoạn tăm tối và tự vẽ nên chương
            truyện tái sinh của chính mình. Mỗi hành trình đời thực đều xứng đáng được kể lại như
            một bộ truyện tranh sống động.
          </p>

          {/* CTAs with modern clean typography */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Link
              to="/explore"
              className="comic-box font-display inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-3 text-xs sm:text-sm font-bold tracking-wider text-primary-foreground transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              ĐỌC CÁC TẬP TRUYỆN
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to="/create"
              className="comic-box font-display inline-flex items-center gap-2 rounded-sm bg-card px-5 py-3 text-xs sm:text-sm font-bold tracking-wider text-foreground transition-all hover:border-primary hover:text-primary active:scale-95"
            >
              <PenTool className="h-4 w-4 text-accent" />
              VIẾT ORIGIN STORY
            </Link>
          </div>

          {/* Elegant Feature Strip (Replaced 3 bulky boxes) */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>100% câu chuyện đời thực</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Khung tranh 16-bit độc bản</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Tự do sáng tác & chia sẻ</span>
            </div>
          </div>
        </div>

        {/* Hero Cinematic Comic Stage */}
        <div className="lg:col-span-5">
          <HeroComicStage />
        </div>
      </section>

      {/* Featured Section */}
      <section className="mt-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="h-8 w-2 bg-primary" />
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-black uppercase tracking-wider text-foreground">
                HÀNH TRÌNH NỔI BẬT
              </h2>
              <p className="font-display text-xs tracking-wider text-muted-foreground uppercase">
                SELECTED COMIC ARCHIVES
              </p>
            </div>
          </div>
          <Link
            to="/explore"
            className="font-display inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary transition hover:underline"
          >
            XEM TẤT CẢ TẬP TRUYỆN <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <JourneyGrid journeys={featured} />
      </section>
    </div>
  );
}
