import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { JourneyGrid } from "@/components/journeys/JourneyGrid";
import { isVisible, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cách mà mình đã — Kể lại hành trình của bạn bằng truyện tranh" },
      { name: "description", content: "Nơi ghi lại những lần học, vấp ngã và bắt đầu lại qua những chương truyện tranh chân thật." },
      { property: "og:title", content: "Cách mà mình đã" },
      { property: "og:description", content: "Kể lại hành trình cá nhân bằng truyện tranh." },
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
    <div className="mx-auto max-w-6xl px-5">
      <section className="grid items-center gap-10 py-16 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-accent">Những câu chuyện có thật</p>
          <h1 className="text-5xl leading-[1.05] font-semibold italic text-primary md:text-7xl">Cách mà mình đã</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            …học một điều mới, thay đổi bản thân, thất bại, đi qua những ngày tối, và bắt đầu lại. Hãy kể lại hành trình
            ấy thành từng chương truyện tranh — chậm rãi, chân thật, theo cách của riêng bạn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/explore">Khám phá hành trình</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/create">Viết câu chuyện của mình</Link></Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 rotate-1">
          <div className="placeholder-art col-span-2 aspect-[16/9] rounded-md border-2 border-primary" />
          <div className="placeholder-art aspect-square rounded-md border-2 border-primary" />
          <div className="placeholder-art flex aspect-square items-end rounded-md border-2 border-primary p-3">
            <span className="rounded-2xl border-2 border-primary bg-card px-3 py-1 text-sm">Mình đã thử lại.</span>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Hành trình nổi bật</h2>
          <Link to="/explore" className="text-sm text-accent hover:underline">Xem tất cả →</Link>
        </div>
        <JourneyGrid journeys={featured} />
      </section>
    </div>
  );
}
